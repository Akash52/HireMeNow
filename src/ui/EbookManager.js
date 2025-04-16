/**
 * EbookManager handles the eBook library and catalog
 */
export class EbookManager {
  constructor(uiManager, ebookReader, notificationManager) {
    this.uiManager = uiManager;
    this.ebookReader = ebookReader;
    this.notificationManager = notificationManager;
    this.catalog = [];
    this.userProgress = this.loadUserProgress();
  }

  /**
   * Initialize the eBook manager
   */
  init() {
    this.loadCatalog();
    this.bindEvents();
    this.ebookReader.init();
  }

  /**
   * Load eBook catalog
   */
  async loadCatalog() {
    // For now, we'll hard-code our available books
    this.catalog = [
      {
        id: 'js-prototypes',
        title: 'JavaScript Prototypes and Inheritance',
        description: 'A comprehensive guide to JavaScript prototypes, inheritance patterns, and performance optimization techniques.',
        cover: '/src/assets/js-prototype-cover.png',
        author: 'HireMeNow Team',
        tags: ['javascript', 'prototypes', 'inheritance', 'performance'],
        chapters: 8,
        lastUpdated: '2023-10-01'
      }
      // More books can be added here
    ];
    
    // Display catalog in the library section
    this.displayLibrary();
  }
  
  /**
   * Display eBook library
   */
  displayLibrary() {
    const libraryContainer = document.getElementById('ebook-library');
    if (!libraryContainer) return;
    
    let html = '';
    
    this.catalog.forEach(book => {
      const progress = this.getUserProgressForBook(book.id);
      const progressPercent = progress ? Math.round(progress.percent) : 0;
      
      html += `
        <div class="ebook-card p-4 bg-white rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
          <div class="aspect-w-2 aspect-h-3 mb-3 bg-gray-100 rounded overflow-hidden">
            <img 
              src="${book.cover || '/src/assets/default-book-cover.png'}" 
              alt="Cover of ${book.title}"
              class="object-cover w-full h-full"
              onerror="this.src='/src/assets/default-book-cover.png'"
            />
          </div>
          <h3 class="font-bold text-indigo-900 mb-1">${book.title}</h3>
          <p class="text-xs text-gray-600 mb-2">Author: ${book.author}</p>
          <div class="mb-3">
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${progressPercent}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">${progressPercent}% completed</p>
          </div>
          <button 
            class="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium read-book-btn"
            data-book-id="${book.id}"
          >
            ${progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
          </button>
        </div>
      `;
    });
    
    libraryContainer.innerHTML = html;
  }
  
  /**
   * Get user progress for a specific book
   * @param {string} bookId - ID of the book
   * @returns {Object|null} - Progress object or null
   */
  getUserProgressForBook(bookId) {
    return this.userProgress.find(p => p.bookId === bookId) || null;
  }
  
  /**
   * Update user progress for the current book
   * @param {number} percent - Percentage completed
   * @param {string} sectionId - Current section ID
   */
  updateUserProgress(percent, sectionId) {
    if (!this.ebookReader.currentBook) return;
    
    const bookId = this.ebookReader.currentBook.id;
    const existing = this.getUserProgressForBook(bookId);
    
    if (existing) {
      existing.percent = percent;
      existing.lastSection = sectionId;
      existing.lastRead = new Date().toISOString();
    } else {
      this.userProgress.push({
        bookId,
        percent,
        lastSection: sectionId,
        lastRead: new Date().toISOString()
      });
    }
    
    this.saveUserProgress();
  }
  
  /**
   * Calculate current progress in the book
   */
  calculateCurrentProgress() {
    if (!this.ebookReader.currentBook) return 0;
    
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return 0;
    
    const scrollPosition = contentArea.scrollTop;
    const totalHeight = contentArea.scrollHeight - contentArea.clientHeight;
    
    return Math.min(100, Math.max(0, Math.round((scrollPosition / totalHeight) * 100)));
  }
  
  /**
   * Load user progress from localStorage
   * @returns {Array} - Array of progress objects
   */
  loadUserProgress() {
    try {
      return JSON.parse(localStorage.getItem('ebook-progress')) || [];
    } catch (error) {
      console.error('Error loading progress:', error);
      return [];
    }
  }
  
  /**
   * Save user progress to localStorage
   */
  saveUserProgress() {
    localStorage.setItem('ebook-progress', JSON.stringify(this.userProgress));
  }
  
  /**
   * Open a book from the library
   * @param {string} bookId - ID of the book to open
   */
  async openBook(bookId) {
    // Show loading indicator
    this.uiManager.showToast('Loading ebook...', 'info');
    
    // Load the book
    const success = await this.ebookReader.loadBook(bookId);
    
    if (success) {
      // Switch to eBook container
      document.getElementById('ebook-tab').click();
      
      // Restore last position if available
      const progress = this.getUserProgressForBook(bookId);
      if (progress && progress.lastSection) {
        setTimeout(() => {
          this.ebookReader.navigateToSection(progress.lastSection);
        }, 500);
      }
      
      // Update progress periodically
      this.startProgressTracking();
    }
  }
  
  /**
   * Start tracking reading progress
   */
  startProgressTracking() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
    }
    
    this._progressInterval = setInterval(() => {
      if (!this.ebookReader.currentBook) return;
      
      const progress = this.calculateCurrentProgress();
      const currentHeading = this.ebookReader.getCurrentHeading();
      
      if (currentHeading) {
        this.updateUserProgress(progress, currentHeading.id);
      }
    }, 30000); // Update every 30 seconds
  }
  
  /**
   * Stop tracking reading progress
   */
  stopProgressTracking() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
    
    // Save final progress
    if (this.ebookReader.currentBook) {
      const progress = this.calculateCurrentProgress();
      const currentHeading = this.ebookReader.getCurrentHeading();
      
      if (currentHeading) {
        this.updateUserProgress(progress, currentHeading.id);
      }
    }
  }
  
  /**
   * Search within the current book
   * @param {string} query - Search query
   */
  searchInBook(query) {
    if (!query || !this.ebookReader.currentBook) return;
    
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return;
    
    // Remove existing highlights
    contentArea.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    
    if (query.trim() === '') return;
    
    const searchResults = [];
    const textNodes = [];
    
    // Get all text nodes
    const walker = document.createTreeWalker(
      contentArea,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return node.textContent.trim() !== ''
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    
    // Search in text nodes
    const regex = new RegExp(query, 'gi');
    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      let match;
      let resultText = text;
      let lastIndex = 0;
      
      while ((match = regex.exec(text)) !== null) {
        // Found a match
        searchResults.push({
          text: match[0],
          context: text.substring(Math.max(0, match.index - 30), Math.min(text.length, match.index + match[0].length + 30)),
          node: textNode
        });
        
        // Mark the text
        const before = resultText.substring(0, match.index - lastIndex);
        const matched = resultText.substring(match.index - lastIndex, match.index - lastIndex + match[0].length);
        resultText = resultText.substring(match.index - lastIndex + match[0].length);
        lastIndex = match.index + match[0].length;
        
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = matched;
        
        textNode.parentNode.insertBefore(document.createTextNode(before), textNode);
        textNode.parentNode.insertBefore(span, textNode);
      }
      
      if (searchResults.length > 0 && textNode.textContent.length > 0) {
        textNode.parentNode.insertBefore(document.createTextNode(resultText), textNode);
        textNode.parentNode.removeChild(textNode);
      }
    });
    
    // Show results count
    if (searchResults.length > 0) {
      this.notificationManager.showToast(`Found ${searchResults.length} matches`, 'success');
      
      // Scroll to first result
      const firstResult = document.querySelector('.search-highlight');
      if (firstResult) {
        firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      this.notificationManager.showToast('No matches found', 'info');
    }
  }
  
  /**
   * Bind events for eBook manager
   */
  bindEvents() {
    document.addEventListener('click', (e) => {
      // Handle read book button
      const readBtn = e.target.closest('.read-book-btn');
      if (readBtn) {
        const bookId = readBtn.getAttribute('data-book-id');
        if (bookId) {
          this.openBook(bookId);
        }
      }
      
      // Handle search button
      if (e.target.closest('#ebook-search-btn')) {
        const query = document.getElementById('ebook-search-input').value;
        this.searchInBook(query);
      }
    });
    
    // Handle search input enter key
    const searchInput = document.getElementById('ebook-search-input');
    if (searchInput) {
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.searchInBook(searchInput.value);
        }
      });
    }
    
    // Handle tab switching to save progress
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-btn')) {
        const targetId = e.target.closest('.nav-btn').getAttribute('aria-controls');
        if (targetId !== 'ebook-container') {
          this.stopProgressTracking();
        } else {
          this.startProgressTracking();
        }
      }
    });
  }
}
