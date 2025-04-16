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
  }

  /**
   * Initialize the eBook reader and bind events
   */
  init() {
    this.bindEvents();
    this.applyFontSize();
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
    
    // Convert code blocks
    html = html.replace(/```([\w-]+)?\n([\s\S]*?)\n```/g, (match, language, code) => {
      const lang = language || 'javascript';
      return `<pre><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>`;
    });
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
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
    }
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
   * Bind events for eBook reader
   */
  bindEvents() {
    document.addEventListener('click', (e) => {
      // Handle bookmark toggle button
      if (e.target.closest('#ebook-bookmark-btn')) {
        this.toggleBookmark();
      }
      
      // Handle highlight button
      if (e.target.closest('#ebook-highlight-btn')) {
        this.highlightSelection();
      }
      
      // Handle bookmarks list button
      if (e.target.closest('#ebook-bookmarks-btn')) {
        this.showBookmarksList();
      }
      
      // Handle font size buttons
      if (e.target.closest('#font-size-small')) {
        this.changeFontSize('small');
      }
      if (e.target.closest('#font-size-medium')) {
        this.changeFontSize('medium');
      }
      if (e.target.closest('#font-size-large')) {
        this.changeFontSize('large');
      }
    });
    
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
