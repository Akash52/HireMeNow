/**
 * EbookReader handles displaying and navigating through ebook content
 */
export class EbookReader {
  constructor(uiManager, notificationManager) {
    this.uiManager = uiManager;
    this.notificationManager = notificationManager;
    this.currentBook = null;
    this.currentChapter = 0;
    this.bookmarks = this.loadBookmarks();
    this.highlights = this.loadHighlights();
    this.fontSize = localStorage.getItem('ebookFontSize') || 'medium';
    this.lastScrollPosition = {};
    this.theme = localStorage.getItem('ebookTheme') || 'default';
    this.availableThemes = {
      default: {
        name: 'Default',
        bgColor: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'indigo'
      },
      sepia: {
        name: 'Sepia',
        bgColor: 'bg-amber-50',
        textColor: 'text-yellow-900',
        accentColor: 'amber'
      },
      night: {
        name: 'Night',
        bgColor: 'bg-gray-900',
        textColor: 'text-gray-100',
        accentColor: 'gray'
      },
      forest: {
        name: 'Forest',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        accentColor: 'green'
      },
      ocean: {
        name: 'Ocean',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900',
        accentColor: 'blue'
      }
    };
  }

  /**
   * Initialize the eBook reader and bind events
   */
  init() {
    this.bindEvents();
    this.applyFontSize();
    this.applyTheme();
  }

  /**
   * Load an eBook by its ID
   * @param {string} bookId - ID of the book to load
   */
  async loadBook(bookId) {
    try {
      // Currently we only support JSEbook
      if (bookId === 'js-prototypes') {
        // Use fetch instead of import for markdown files
        const response = await fetch('/src/questions/ebook/JSEbook.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch book content: ${response.status}`);
        }
        
        const content = await response.text();
        this.currentBook = {
          id: bookId,
          title: 'JavaScript Prototypes and Inheritance',
          content: content
        };
        
        this.displayBook();
        this.notificationManager.showToast('eBook loaded successfully', 'success');
        return true;
      } else {
        throw new Error('Book not found');
      }
    } catch (error) {
      console.error('Error loading book:', error);
      this.notificationManager.showToast('Failed to load eBook', 'error');
      return false;
    }
  }

  /**
   * Display the current book in the reader
   */
  displayBook() {
    if (!this.currentBook) return;
    
    // Get container elements
    const container = document.getElementById('ebook-container');
    const contentArea = document.getElementById('ebook-content');
    const tocArea = document.getElementById('ebook-toc');
    
    if (!container || !contentArea || !tocArea) return;
    
    // Make the container visible
    container.classList.remove('hidden');
    
    // Set the title
    document.getElementById('ebook-title').textContent = this.currentBook.title;
    
    // Process content and extract TOC
    const { content, toc } = this.processContent(this.currentBook.content);
    
    // Display content with proper rendering
    contentArea.innerHTML = content;
    
    // Generate and display table of contents
    this.renderTableOfContents(toc, tocArea);
    
    // Apply syntax highlighting to code blocks
    this.applySyntaxHighlighting();
    
    // Apply any saved bookmarks and highlights
    this.applyBookmarks();
    this.applyHighlights();
    
    // Restore last scroll position for this book
    this.restoreScrollPosition();
    
    // Apply theme
    this.applyTheme();
    
    // Add reading controls
    this.addReadingControls();
  }
  
  /**
   * Process markdown content to extract TOC and enhance content
   * @param {string} markdown - Raw markdown content
   * @returns {Object} - Processed content and TOC
   */
  processContent(markdown) {
    const headings = [];
    
    // First pass: extract TOC
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      
      if (inCodeBlock) continue;
      
      // Extract headings
      if (line.startsWith('# ')) {
        headings.push({ level: 1, text: line.substring(2), id: this.slugify(line.substring(2)), line: i });
      } else if (line.startsWith('## ')) {
        headings.push({ level: 2, text: line.substring(3), id: this.slugify(line.substring(3)), line: i });
      } else if (line.startsWith('### ')) {
        headings.push({ level: 3, text: line.substring(4), id: this.slugify(line.substring(4)), line: i });
      }
    }
    
    // Second pass: enhance content with IDs and navigation
    let enhancedContent = '';
    inCodeBlock = false;
    let insideSection = false;
    let currentChapter = null;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        enhancedContent += line + '\n';
        continue;
      }
      
      if (!inCodeBlock) {
        // Add IDs to headings for navigation
        if (line.startsWith('# ')) {
          currentChapter = this.slugify(line.substring(2));
          if (insideSection) enhancedContent += '</section>\n';
          enhancedContent += `<section id="${currentChapter}" class="chapter">\n`;
          enhancedContent += `<h1 id="${this.slugify(line.substring(2))}">${line.substring(2)}</h1>\n`;
          insideSection = true;
        } else if (line.startsWith('## ')) {
          const id = this.slugify(line.substring(3));
          enhancedContent += `<h2 id="${id}">${line.substring(3)}</h2>\n`;
        } else if (line.startsWith('### ')) {
          const id = this.slugify(line.substring(4));
          enhancedContent += `<h3 id="${id}">${line.substring(4)}</h3>\n`;
        } else {
          enhancedContent += line + '\n';
        }
      } else {
        enhancedContent += line + '\n';
      }
    }
    
    if (insideSection) enhancedContent += '</section>\n';
    
    return {
      content: this.markdownToHtml(enhancedContent),
      toc: headings
    };
  }
  
  /**
   * Convert markdown to HTML
   * @param {string} markdown - Markdown content
   * @returns {string} - HTML content
   */
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Convert code blocks with copy button functionality
    html = html.replace(/```([\w-]+)?\n([\s\S]*?)\n```/g, (match, language, code) => {
      const lang = language || 'javascript';
      const escapedCode = this.escapeHtml(code.trim());
      const uniqueId = 'code-' + Math.random().toString(36).substring(2, 15);
      
      return `
        <div class="code-block-container relative group">
          <div class="code-header bg-gray-800 text-gray-300 text-xs py-1 px-3 flex justify-between items-center">
            <span>${lang}</span>
            <button class="copy-code-btn" data-clipboard-target="#${uniqueId}" aria-label="Copy code">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <pre><code id="${uniqueId}" class="language-${lang}">${escapedCode}</code></pre>
        </div>
      `;
    });
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Convert headers (not handled by our section approach)
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    
    // Convert bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Convert blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Convert horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    
    // Convert unordered lists
    html = html.replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>');
    // Combine adjacent list items
    html = html.replace(/<\/ul>\n<ul>/g, '');
    
    // Convert ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');
    // Combine adjacent ordered list items
    html = html.replace(/<\/ol>\n<ol>/g, '');
    
    // Convert paragraphs (lines that are not part of other elements)
    html = html.replace(/^(?!(<h[1-6]|<ul|<ol|<blockquote|<hr|<pre|<div|<p))(.+)$/gm, '<p>$2</p>');
    
    // Fix empty lines
    html = html.replace(/<p><\/p>/g, '');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>');
    
    // Convert images with alt text and title
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)(?:\s"([^"]+)")?\)/g, (match, alt, src, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<figure class="my-4">
        <img src="${src}" alt="${alt}" ${titleAttr} class="rounded-lg max-w-full mx-auto shadow-md" />
        ${alt ? `<figcaption class="text-center text-sm text-gray-600 mt-2">${alt}</figcaption>` : ''}
      </figure>`;
    });
    
    // Return the HTML
    return html;
  }
  
  /**
   * Escape HTML special characters
   * @param {string} html - Raw HTML
   * @returns {string} - Escaped HTML
   */
  escapeHtml(html) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return html.replace(/[&<>"']/g, s => entityMap[s]);
  }
  
  /**
   * Convert string to URL-friendly slug
   * @param {string} text - Text to slugify
   * @returns {string} - Slugified text
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  /**
   * Render table of contents
   * @param {Array} toc - Table of contents
   * @param {HTMLElement} container - Container element
   */
  renderTableOfContents(toc, container) {
    if (!container) return;
    
    let html = '<ul class="ebook-toc-list">';
    let currentLevel = 1;
    
    toc.forEach((item) => {
      if (item.level > currentLevel) {
        html += '<ul class="ebook-toc-sublist">';
        currentLevel = item.level;
      } else if (item.level < currentLevel) {
        html += '</ul>';
        currentLevel = item.level;
      }
      
      html += `<li>
        <a href="#${item.id}" class="toc-link" data-line="${item.line}">${item.text}</a>
      </li>`;
    });
    
    // Close any open lists
    for (let i = currentLevel; i > 0; i--) {
      html += '</ul>';
    }
    
    container.innerHTML = html;
    
    // Add click event listeners
    container.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.getAttribute('href').substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Update current section in UI
          this.highlightCurrentTocItem(link);
        }
      });
    });
  }
  
  /**
   * Highlight current TOC item
   * @param {HTMLElement} item - TOC item to highlight
   */
  highlightCurrentTocItem(item) {
    if (!item) return;
    
    // Remove active class from all items
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current item
    item.classList.add('active');
  }
  
  /**
   * Apply syntax highlighting to code blocks
   */
  applySyntaxHighlighting() {
    if (window.hljs) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      
      // Initialize clipboard for code blocks
      this.initializeClipboard();
    }
  }
  
  /**
   * Initialize clipboard functionality for code blocks
   */
  initializeClipboard() {
    document.querySelectorAll('.copy-code-btn').forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-clipboard-target');
        const codeElement = document.querySelector(targetId);
        
        if (codeElement) {
          const textToCopy = codeElement.textContent;
          
          // Use the Clipboard API if available
          if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
              .then(() => {
                // Show copied feedback
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.classList.add('copied');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                  button.innerHTML = originalText;
                  button.classList.remove('copied');
                }, 2000);
              })
              .catch(err => {
                console.error('Could not copy text: ', err);
                this.notificationManager.showToast('Failed to copy to clipboard', 'error');
              });
          } else {
            // Fallback for browsers without Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
              document.execCommand('copy');
              const originalText = button.innerHTML;
              button.innerHTML = '<i class="fas fa-check"></i> Copied!';
              button.classList.add('copied');
              
              setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
              }, 2000);
            } catch (err) {
              console.error('Could not copy text: ', err);
              this.notificationManager.showToast('Failed to copy to clipboard', 'error');
            }
            
            document.body.removeChild(textarea);
          }
        }
      });
    });
  }
  
  /**
   * Navigate to a specific section
   * @param {string} sectionId - ID of the section to navigate to
   */
  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this.saveScrollPosition();
    }
  }
  
  /**
   * Toggle bookmark for current position
   */
  toggleBookmark() {
    const currentHeading = this.getCurrentHeading();
    if (!currentHeading) return;
    
    const { id, text } = currentHeading;
    const bookmarkExists = this.bookmarks.some(b => b.id === id && b.bookId === this.currentBook.id);
    
    if (bookmarkExists) {
      // Remove bookmark
      this.bookmarks = this.bookmarks.filter(b => !(b.id === id && b.bookId === this.currentBook.id));
      this.notificationManager.showToast('Bookmark removed', 'info');
    } else {
      // Add bookmark
      this.bookmarks.push({
        id,
        text,
        bookId: this.currentBook.id,
        date: new Date().toISOString()
      });
      this.notificationManager.showToast('Bookmark added', 'success');
    }
    
    this.saveBookmarks();
    this.applyBookmarks();
  }
  
  /**
   * Get current heading based on scroll position
   * @returns {Object|null} - Current heading or null
   */
  getCurrentHeading() {
    const headings = Array.from(document.querySelectorAll('#ebook-content h1, #ebook-content h2, #ebook-content h3'));
    if (!headings.length) return null;
    
    const scrollPosition = document.getElementById('ebook-content').scrollTop;
    let currentHeading = null;
    
    for (const heading of headings) {
      if (heading.offsetTop <= scrollPosition + 100) {
        currentHeading = {
          id: heading.id,
          text: heading.textContent,
          element: heading
        };
      } else {
        break;
      }
    }
    
    return currentHeading || { id: headings[0].id, text: headings[0].textContent, element: headings[0] };
  }
  
  /**
   * Highlight selected text
   */
  highlightSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    // Check if selection is within the content area
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea.contains(range.commonAncestorContainer)) return;
    
    // Create a highlight span
    const highlightId = 'highlight-' + Date.now();
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'ebook-highlight';
    highlightSpan.id = highlightId;
    
    // Insert highlight span
    try {
      range.surroundContents(highlightSpan);
      
      // Save highlight
      this.highlights.push({
        id: highlightId,
        bookId: this.currentBook.id,
        text: highlightSpan.textContent,
        path: this.getElementPath(highlightSpan),
        date: new Date().toISOString()
      });
      
      this.saveHighlights();
      this.notificationManager.showToast('Text highlighted', 'success');
    } catch (error) {
      console.error('Error highlighting text:', error);
      this.notificationManager.showToast('Could not highlight selection', 'error');
    }
    
    // Clear selection
    selection.removeAllRanges();
  }
  
  /**
   * Get path to element for serialization
   * @param {HTMLElement} element - Element to get path for
   * @returns {Array} - Path to element
   */
  getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.getElementById('ebook-content')) {
      let index = 0;
      let sibling = current;
      
      while (sibling) {
        if (sibling.nodeName === current.nodeName) index++;
        sibling = sibling.previousElementSibling;
      }
      
      path.unshift({
        tag: current.nodeName.toLowerCase(),
        index
      });
      
      current = current.parentElement;
    }
    
    return path;
  }
  
  /**
   * Apply saved bookmarks to the UI
   */
  applyBookmarks() {
    // Clear existing bookmark indicators
    document.querySelectorAll('.bookmark-indicator').forEach(el => el.remove());
    
    // Add bookmark indicators
    this.bookmarks.forEach(bookmark => {
      if (bookmark.bookId !== this.currentBook.id) return;
      
      const element = document.getElementById(bookmark.id);
      if (element) {
        const indicator = document.createElement('span');
        indicator.className = 'bookmark-indicator';
        indicator.innerHTML = '<i class="fas fa-bookmark"></i>';
        element.prepend(indicator);
      }
    });
  }
  
  /**
   * Apply saved highlights to the UI
   */
  applyHighlights() {
    // Apply highlights based on saved paths
    this.highlights.forEach(highlight => {
      if (highlight.bookId !== this.currentBook.id) return;
      
      // Try to find the element by ID first
      let element = document.getElementById(highlight.id);
      
      // If not found, try to reconstruct from path
      if (!element && highlight.path) {
        try {
          let current = document.getElementById('ebook-content');
          
          for (const step of highlight.path) {
            let count = step.index;
            let child = current.firstElementChild;
            
            while (child && count > 0) {
              if (child.nodeName.toLowerCase() === step.tag) count--;
              if (count > 0) child = child.nextElementSibling;
            }
            
            if (!child || child.nodeName.toLowerCase() !== step.tag) {
              throw new Error('Path navigation failed');
            }
            
            current = child;
          }
          
          if (current) {
            const span = document.createElement('span');
            span.className = 'ebook-highlight';
            span.id = highlight.id;
            span.textContent = highlight.text;
            
            // Replace text with highlighted version
            if (current.nodeType === Node.TEXT_NODE) {
              current.parentNode.replaceChild(span, current);
            } else {
              current.innerHTML = `<span class="ebook-highlight" id="${highlight.id}">${current.innerHTML}</span>`;
            }
          }
        } catch (error) {
          console.error('Error applying highlight:', error);
        }
      }
    });
  }
  
  /**
   * Change font size
   * @param {string} size - Font size (small, medium, large)
   */
  changeFontSize(size) {
    this.fontSize = size;
    localStorage.setItem('ebookFontSize', size);
    this.applyFontSize();
    this.notificationManager.showToast(`Font size changed to ${size}`, 'info');
  }
  
  /**
   * Apply current font size setting
   */
  applyFontSize() {
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return;
    
    contentArea.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (this.fontSize) {
      case 'small':
        contentArea.classList.add('text-sm');
        break;
      case 'medium':
        contentArea.classList.add('text-base');
        break;
      case 'large':
        contentArea.classList.add('text-lg');
        break;
      default:
        contentArea.classList.add('text-base');
    }
  }
  
  /**
   * Save bookmarks to localStorage
   */
  saveBookmarks() {
    localStorage.setItem('ebook-bookmarks', JSON.stringify(this.bookmarks));
  }
  
  /**
   * Load bookmarks from localStorage
   * @returns {Array} - Array of bookmarks
   */
  loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('ebook-bookmarks')) || [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }
  
  /**
   * Save highlights to localStorage
   */
  saveHighlights() {
    localStorage.setItem('ebook-highlights', JSON.stringify(this.highlights));
  }
  
  /**
   * Load highlights from localStorage
   * @returns {Array} - Array of highlights
   */
  loadHighlights() {
    try {
      return JSON.parse(localStorage.getItem('ebook-highlights')) || [];
    } catch (error) {
      console.error('Error loading highlights:', error);
      return [];
    }
  }
  
  /**
   * Save current scroll position
   */
  saveScrollPosition() {
    if (!this.currentBook) return;
    
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      this.lastScrollPosition[this.currentBook.id] = contentArea.scrollTop;
      localStorage.setItem('ebook-scroll', JSON.stringify(this.lastScrollPosition));
    }
  }
  
  /**
   * Restore saved scroll position
   */
  restoreScrollPosition() {
    if (!this.currentBook) return;
    
    try {
      if (!this.lastScrollPosition) {
        this.lastScrollPosition = JSON.parse(localStorage.getItem('ebook-scroll')) || {};
      }
      
      const contentArea = document.getElementById('ebook-content');
      if (contentArea && this.lastScrollPosition[this.currentBook.id]) {
        setTimeout(() => {
          contentArea.scrollTop = this.lastScrollPosition[this.currentBook.id];
        }, 100);
      }
    } catch (error) {
      console.error('Error restoring scroll position:', error);
    }
  }
  
  /**
   * Show bookmarks list
   */
  showBookmarksList() {
    const bookmarksForCurrentBook = this.bookmarks.filter(b => b.bookId === this.currentBook.id);
    
    if (bookmarksForCurrentBook.length === 0) {
      this.notificationManager.showToast('No bookmarks for this book', 'info');
      return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ios-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'bookmarks-title');
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'bg-white mx-4 p-5 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl animate-slide-up border border-gray-200 ios-modal-content';
    
    // Create modal header
    let html = `
      <div class="flex justify-between items-center mb-4">
        <h3 id="bookmarks-title" class="text-lg sm:text-xl font-bold text-indigo-900">Bookmarks</h3>
        <button class="close-modal text-gray-500 hover:text-gray-800">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="bookmarks-list max-h-80 overflow-y-auto">
    `;
    
    // Add bookmarks
    html += '<ul class="divide-y divide-gray-200">';
    bookmarksForCurrentBook.forEach(bookmark => {
      html += `
        <li class="py-3">
          <a href="#${bookmark.id}" class="bookmark-link flex justify-between group">
            <span class="text-indigo-600 group-hover:text-indigo-800">${bookmark.text}</span>
            <button class="delete-bookmark text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" data-id="${bookmark.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </a>
        </li>
      `;
    });
    html += '</ul>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    
    // Add event listeners
    content.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    content.querySelectorAll('.bookmark-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.getAttribute('href').substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          document.body.removeChild(modal);
        }
      });
    });
    
    content.querySelectorAll('.delete-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.bookmarks = this.bookmarks.filter(b => !(b.id === id && b.bookId === this.currentBook.id));
        this.saveBookmarks();
        this.applyBookmarks();
        document.body.removeChild(modal);
        this.notificationManager.showToast('Bookmark deleted', 'info');
      });
    });
    
    // Add modal to page
    document.body.appendChild(modal);
  }
  
  /**
   * Add reading controls to the ebook container
   */
  addReadingControls() {
    const container = document.getElementById('ebook-container');
    if (!container) return;
    
    // Check if controls already exist
    if (document.getElementById('ebook-reading-controls')) return;
    
    // Create reading controls
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'ebook-reading-controls';
    controlsDiv.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-indigo-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg z-40 transition-all duration-300 hover:bg-indigo-800';
    
    // Add control buttons
    controlsDiv.innerHTML = `
      <button id="focus-mode-btn" class="p-2 hover:bg-indigo-700 rounded-full" title="Toggle Focus Mode">
        <i class="fas fa-eye"></i>
      </button>
      <button id="theme-toggle-btn" class="p-2 hover:bg-indigo-700 rounded-full" title="Change Theme">
        <i class="fas fa-palette"></i>
      </button>
      <div class="font-controls flex space-x-1">
        <button id="font-size-small" class="p-2 hover:bg-indigo-700 rounded-full" title="Small Text">
          <i class="fas fa-text-height"></i><small>-</small>
        </button>
        <button id="font-size-medium" class="p-2 hover:bg-indigo-700 rounded-full" title="Medium Text">
          <i class="fas fa-text-height"></i>
        </button>
        <button id="font-size-large" class="p-2 hover:bg-indigo-700 rounded-full" title="Large Text">
          <i class="fas fa-text-height"></i><small>+</small>
        </button>
      </div>
      <div class="separator border-l border-indigo-700 mx-1"></div>
      <button id="ebook-bookmark-btn" class="p-2 hover:bg-indigo-700 rounded-full" title="Add Bookmark">
        <i class="fas fa-bookmark"></i>
      </button>
      <button id="ebook-highlight-btn" class="p-2 hover:bg-indigo-700 rounded-full" title="Highlight Text">
        <i class="fas fa-highlighter"></i>
      </button>
      <button id="ebook-bookmarks-btn" class="p-2 hover:bg-indigo-700 rounded-full" title="View Bookmarks">
        <i class="fas fa-list"></i>
      </button>
    `;
    
    // Add controls to container
    document.body.appendChild(controlsDiv);
    
    // Auto-hide controls when not interacting
    let timeoutId;
    function showControls() {
      controlsDiv.classList.remove('opacity-0');
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (!controlsDiv.matches(':hover')) {
          controlsDiv.classList.add('opacity-0');
        }
      }, 3000);
    }
    
    controlsDiv.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      controlsDiv.classList.remove('opacity-0');
    });
    
    controlsDiv.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        controlsDiv.classList.add('opacity-0');
      }, 2000);
    });
    
    document.getElementById('ebook-content').addEventListener('mousemove', showControls);
    
    // Add theme selection dropdown event
    document.getElementById('theme-toggle-btn').addEventListener('click', (e) => {
      this.showThemeSelector(e);
    });
    
    // Add direct event listeners to font size buttons
    document.getElementById('font-size-small').addEventListener('click', () => {
      this.changeFontSize('small');
    });
    
    document.getElementById('font-size-medium').addEventListener('click', () => {
      this.changeFontSize('medium');
    });
    
    document.getElementById('font-size-large').addEventListener('click', () => {
      this.changeFontSize('large');
    });
    
    // Add event listeners for other buttons
    document.getElementById('ebook-bookmark-btn').addEventListener('click', () => {
      this.toggleBookmark();
    });
    
    document.getElementById('ebook-highlight-btn').addEventListener('click', () => {
      this.highlightSelection();
    });
    
    document.getElementById('ebook-bookmarks-btn').addEventListener('click', () => {
      this.showBookmarksList();
    });
    
    document.getElementById('focus-mode-btn').addEventListener('click', () => {
      const container = document.getElementById('ebook-container');
      const isActive = container.classList.contains('focus-mode');
      
      if (window.ebookManager) {
        window.ebookManager.toggleFocusMode(!isActive);
      }
    });
    
    // Initially hide controls after 3s
    showControls();
  }
  
  /**
   * Show theme selector dropdown
   * @param {Event} e - Click event
   */
  showThemeSelector(e) {
    e.stopPropagation();
    
    // Remove existing theme selector if present
    const existingSelector = document.getElementById('theme-selector');
    if (existingSelector) {
      existingSelector.remove();
      return;
    }
    
    // Create theme selector
    const themeSelector = document.createElement('div');
    themeSelector.id = 'theme-selector';
    themeSelector.className = 'absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-3 min-w-[150px] text-gray-800 grid grid-cols-1 gap-2 transform animate-pop-in';
    
    // Add themes
    for (const [themeId, theme] of Object.entries(this.availableThemes)) {
      const themeButton = document.createElement('button');
      themeButton.className = `
        flex items-center p-2 rounded hover:bg-gray-100 transition-colors
        ${this.theme === themeId ? 'bg-gray-200' : ''}
      `;
      themeButton.innerHTML = `
        <span class="w-4 h-4 rounded-full ${theme.bgColor} border border-gray-300 mr-3"></span>
        ${theme.name}
      `;
      
      themeButton.addEventListener('click', () => {
        this.changeTheme(themeId);
        themeSelector.remove();
      });
      
      themeSelector.appendChild(themeButton);
    }
    
    // Position the dropdown
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    
    // Create a parent for positioning (relative to the viewport)
    const positionWrapper = document.createElement('div');
    positionWrapper.style.position = 'fixed';
    positionWrapper.style.zIndex = '100';
    positionWrapper.style.left = `${buttonRect.left + buttonRect.width/2}px`;
    positionWrapper.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
    positionWrapper.style.transform = 'translateX(-50%)';
    positionWrapper.appendChild(themeSelector);
    
    // Add to page
    document.body.appendChild(positionWrapper);
    
    // Close when clicking outside
    document.addEventListener('click', function closeThemeSelector(event) {
      if (!themeSelector.contains(event.target) && event.target !== button) {
        if (document.body.contains(positionWrapper)) {
          document.body.removeChild(positionWrapper);
        }
        document.removeEventListener('click', closeThemeSelector);
      }
    });
  }
  
  /**
   * Change theme
   * @param {string} themeId - ID of the theme to apply
   */
  changeTheme(themeId) {
    if (!this.availableThemes[themeId]) return;
    
    this.theme = themeId;
    localStorage.setItem('ebookTheme', themeId);
    this.applyTheme();
    
    this.notificationManager.showToast(`Theme changed to ${this.availableThemes[themeId].name}`, 'info');
  }
  
  /**
   * Apply current theme
   */
  applyTheme() {
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return;
    
    const theme = this.availableThemes[this.theme] || this.availableThemes.default;
    
    // Remove all theme classes
    Object.values(this.availableThemes).forEach(theme => {
      contentArea.classList.remove(theme.bgColor, theme.textColor);
    });
    
    // Add new theme classes
    contentArea.classList.add(theme.bgColor, theme.textColor);
  }

  /**
   * Bind events for eBook reader
   */
  bindEvents() {
    // Most button handlers are now attached directly in addReadingControls
    
    // Save scroll position when user scrolls
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      contentArea.addEventListener('scroll', () => {
        this.saveScrollPosition();
        this.updateCurrentTocItem();
      });
    }
  }
  
  /**
   * Update which TOC item is highlighted based on scroll position
   */
  updateCurrentTocItem() {
    const currentHeading = this.getCurrentHeading();
    if (!currentHeading) return;
    
    const tocItem = document.querySelector(`.toc-link[href="#${currentHeading.id}"]`);
    if (tocItem) {
      this.highlightCurrentTocItem(tocItem);
    }
  }
}
