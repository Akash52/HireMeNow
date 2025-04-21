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
    this.readingStats = this.loadReadingStats();
    this.achievements = this.loadAchievements();
    this.readingSessions = [];
    this.currentSession = null;
    this.quotes = [
      "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      "Reading is to the mind what exercise is to the body.",
      "The reading of all good books is like conversation with the finest minds of past centuries.",
      "Reading is a discount ticket to everywhere.",
      "A book is a dream that you hold in your hand.",
      "Reading is an exercise in empathy; an exercise in walking in someone else's shoes for a while.",
      "Reading brings us unknown friends.",
      "Once you learn to read, you will be forever free.",
      "Books are a uniquely portable magic.",
      "Reading should not be presented to children as a chore or duty, but as a gift.",
      "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book."
    ];
    this.lastQuoteTime = 0;
    
    // Make EbookManager accessible globally for controls interaction
    window.ebookManager = this;
  }

  /**
   * Initialize the eBook manager
   */
  init() {
    this.loadCatalog();
    this.bindEvents();
    this.ebookReader.init();
    
    // Initialize animation manager
    this.initAnimations();
    
    // Initialize the reading goals if they don't exist
    if (!this.readingStats.goals) {
      this.readingStats.goals = {
        dailyMinutes: 20,
        weeklyBooks: 1,
        monthlyPages: 300
      };
    }
    
    // Initialize achievements if empty
    if (!this.achievements.length) {
      this.initializeAchievements();
    }
    
    // Update UI with reading stats
    this.updateReadingStatsUI();
  }

  /**
   * Initialize animations for the eBook UI
   */
  initAnimations() {
    import('../ui/AnimationManager.js').then(module => {
      const AnimationManager = module.AnimationManager;
      this.animationManager = new AnimationManager();
      this.animationManager.init();
      
      // Apply fluid background to the hero section
      const heroSection = document.querySelector('.ebook-hero');
      if (heroSection) {
        this.animationManager.createFluidBackground(heroSection);
      }
      
      // Apply typewriter effect to the hero title
      const heroTitle = document.querySelector('.ebook-hero-title');
      if (heroTitle) {
        heroTitle.classList.add('typewriter');
        this.animationManager.setupTypewriterEffect();
      }
    }).catch(err => {
      console.error('Failed to load animation manager:', err);
    });
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
        cover: 'https://i.ibb.co/HD2k3CNc/js-prototype-cover.png',
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
    
    // Clear any existing content
    libraryContainer.innerHTML = '';
    
    if (!this.catalog.length) {
      libraryContainer.innerHTML = '<p class="col-span-full text-gray-600">No books available.</p>';
      return;
    }
    
    // Add book cards with enhanced Vite-style design
    const cardElements = [];
    
    this.catalog.forEach((book, index) => {
      const progress = this.getUserProgressForBook(book.id);
      const progressPercent = progress ? progress.percent : 0;
      
      const bookCard = document.createElement('div');
      bookCard.className = 'ebook-library-card spotlight-card vite-section';
      bookCard.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
      
      bookCard.innerHTML = `
        <div class="ebook-card h-full flex flex-col">
          <div class="overflow-hidden h-40 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl font-bold text-indigo-600/20">${book.title.charAt(0)}</span>
            </div>
            ${book.cover ? `<img src="${book.cover}" alt="${book.title}" class="w-full h-full object-cover">` : ''}
            <div class="absolute top-2 right-2 text-xs px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-indigo-600 font-medium">
              ${book.chapters} chapters
            </div>
          </div>
          
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold text-gray-800 mb-1">${book.title}</h3>
            <p class="text-sm text-gray-600 mb-3 flex-1">${book.description.substring(0, 80)}${book.description.length > 80 ? '...' : ''}</p>
            
            <div class="mt-auto">
              <div class="flex justify-between text-xs text-gray-500 mb-2">
                <span>${book.author}</span>
                <span>${progressPercent > 0 ? `${progressPercent}% complete` : 'Not started'}</span>
              </div>
              
              <div class="reading-progress-bar mb-3 ${progressPercent > 0 ? 'progress-pulse' : ''}">
                <div class="reading-progress-value" style="width: ${progressPercent}%"></div>
              </div>
              
              <button class="read-book-btn w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors" data-book-id="${book.id}">
                ${progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
              </button>
            </div>
          </div>
        </div>
        
        <div class="ebook-card-overlay">
          <button class="read-book-btn py-2 px-6 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors" data-book-id="${book.id}">
            ${progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
          </button>
        </div>
      `;
      
      libraryContainer.appendChild(bookCard);
      cardElements.push(bookCard);
    });
    
    // Make sure the cards are visible immediately
    cardElements.forEach(card => {
      card.classList.add('loaded');
    });
    
    // Then observe for animations if AnimationManager is available
    if (this.animationManager) {
      cardElements.forEach(card => {
        this.animationManager.observeElement(card);
      });
    }
    
    // Update reading stats UI
    this.updateReadingStatsUI();
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
    
    try {
      // Load the book
      const success = await this.ebookReader.loadBook(bookId);
      
      if (success) {
        // Make sure eBook container is visible by clicking nav button
        const ebookNavBtn = document.getElementById('nav-ebook');
        if (ebookNavBtn) {
          ebookNavBtn.click();
        }

        // Switch to reader tab view
        const readerTab = document.getElementById('ebook-tab');
        if (readerTab) {
          readerTab.click();
        }
        
        // Restore last position if available
        const progress = this.getUserProgressForBook(bookId);
        if (progress && progress.lastSection) {
          setTimeout(() => {
            this.ebookReader.navigateToSection(progress.lastSection);
          }, 500);
        }
        
        // Update progress periodically
        this.startProgressTracking();
      } else {
        throw new Error('Failed to load book');
      }
    } catch (error) {
      console.error('Error opening book:', error);
      this.notificationManager.showToast('Failed to open book. Please try again.', 'error');
      
      // Try with fallback content if available
      try {
        if (this.ebookReader.getFallbackBookContent) {
          const success = await this.ebookReader.loadBook(bookId, true);
          if (success) {
            // Continue with book opening as in the success case above
            const ebookNavBtn = document.getElementById('nav-ebook');
            if (ebookNavBtn) ebookNavBtn.click();
            
            const readerTab = document.getElementById('ebook-tab');
            if (readerTab) readerTab.click();
            
            this.startProgressTracking();
          }
        }
      } catch (fallbackError) {
        console.error('Fallback book loading also failed:', fallbackError);
      }
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
    
    // Start reading session if not already started
    if (!this.currentSession) {
      this.startReadingSession();
      
      // Award first book achievement if this is their first time
      this.checkAndAwardAchievement('first-book', 1);
    }
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
    
    // End reading session
    this.endReadingSession();
  }
  
  /**
   * Search within the current book
   * @param {string} query - Search query
   */
  searchInBook(query) {
    if (!query || !this.ebookReader.currentBook) return;
    
    // Track search usage for achievement
    if (this.currentSession) {
      this.currentSession.searchCount++;
      
      if (this.currentSession.searchCount % 2 === 0) {
        this.checkAndAwardAchievement('search-master', 1);
      }
    }
    
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
   * Toggle focus mode
   * @param {boolean} activate - Whether to activate or deactivate focus mode
   */
  toggleFocusMode(activate) {
    const contentArea = document.getElementById('ebook-content');
    const container = document.getElementById('ebook-container');
    
    if (!contentArea || !container) return;
    
    if (activate) {
      // Check if user has unlocked focus mode
      const focusModeAchievement = this.achievements.find(a => a.id === 'reading-streak-7');
      if (!focusModeAchievement?.unlocked) {
        this.notificationManager.showToast('Unlock focus mode by achieving a 7-day reading streak', 'info');
        return;
      }
      
      // Activate focus mode
      container.classList.add('focus-mode');
      document.body.classList.add('dimmed-background');
      
      // Track focus mode usage
      if (this.currentSession) {
        this.currentSession.focusModeActivations++;
      }
      
      this.notificationManager.showToast('Focus mode activated', 'info');
    } else {
      // Deactivate focus mode
      container.classList.remove('focus-mode');
      document.body.classList.remove('dimmed-background');
      this.notificationManager.showToast('Focus mode deactivated', 'info');
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
      
      // Handle focus mode toggle
      if (e.target.closest('#focus-mode-btn')) {
        const isActive = document.getElementById('ebook-container').classList.contains('focus-mode');
        this.toggleFocusMode(!isActive);
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
    
    // Handle window unload to save progress and end session
    window.addEventListener('beforeunload', () => {
      if (this.ebookReader.currentBook) {
        const progress = this.calculateCurrentProgress();
        const currentHeading = this.ebookReader.getCurrentHeading();
        
        if (currentHeading) {
          this.updateUserProgress(progress, currentHeading.id);
        }
      }
      
      // End reading session
      this.endReadingSession();
    });
  }

  /**
   * Load user reading statistics
   * @returns {Object} - Reading statistics object
   */
  loadReadingStats() {
    try {
      const stats = JSON.parse(localStorage.getItem('ebook-reading-stats')) || {
        streaks: {
          current: 0,
          longest: 0,
          lastReadDate: null
        },
        totalTimeRead: 0, // in minutes
        booksCompleted: 0,
        sessionsCompleted: 0,
        goals: {
          dailyMinutes: 20,
          weeklyBooks: 1,
          monthlyPages: 300
        },
        calendar: {} // Format: { "YYYY-MM-DD": minutesRead }
      };
      return stats;
    } catch (error) {
      console.error('Error loading reading stats:', error);
      return {
        streaks: { current: 0, longest: 0, lastReadDate: null },
        totalTimeRead: 0,
        booksCompleted: 0,
        sessionsCompleted: 0,
        goals: { dailyMinutes: 20, weeklyBooks: 1, monthlyPages: 300 },
        calendar: {}
      };
    }
  }
  
  /**
   * Save user reading statistics
   */
  saveReadingStats() {
    localStorage.setItem('ebook-reading-stats', JSON.stringify(this.readingStats));
    this.updateReadingStatsUI();
  }
  
  /**
   * Load user achievements
   * @returns {Array} - Array of achievement objects
   */
  loadAchievements() {
    try {
      return JSON.parse(localStorage.getItem('ebook-achievements')) || [];
    } catch (error) {
      console.error('Error loading achievements:', error);
      return [];
    }
  }
  
  /**
   * Save user achievements
   */
  saveAchievements() {
    localStorage.setItem('ebook-achievements', JSON.stringify(this.achievements));
  }
  
  /**
   * Initialize the default achievements
   */
  initializeAchievements() {
    this.achievements = [
      {
        id: 'first-book',
        title: 'Book Rookie',
        description: 'Open your first book',
        icon: '📖',
        unlocked: false,
        progress: 0,
        target: 1,
        reward: 'Access to reading insights'
      },
      {
        id: 'reading-streak-3',
        title: 'Consistent Reader',
        description: 'Achieve a 3-day reading streak',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        target: 3,
        reward: 'New theme option'
      },
      {
        id: 'reading-streak-7',
        title: 'Weekly Warrior',
        description: 'Achieve a 7-day reading streak',
        icon: '🏆',
        unlocked: false,
        progress: 0,
        target: 7,
        reward: 'Unlock focus mode'
      },
      {
        id: 'reading-time-60',
        title: 'Hour Explorer',
        description: 'Read for a total of 60 minutes',
        icon: '⏱️',
        unlocked: false,
        progress: 0,
        target: 60,
        reward: 'Custom bookmark styles'
      },
      {
        id: 'book-complete',
        title: 'Finisher',
        description: 'Complete your first book',
        icon: '🎉',
        unlocked: false,
        progress: 0,
        target: 1,
        reward: 'Reading pace insights'
      },
      {
        id: 'search-master',
        title: 'Researcher',
        description: 'Search within books 10 times',
        icon: '🔍',
        unlocked: false,
        progress: 0,
        target: 10,
        reward: 'Enhanced search features'
      }
    ];
    this.saveAchievements();
  }
  
  /**
   * Start a reading session
   */
  startReadingSession() {
    if (this.currentSession) return;
    
    this.currentSession = {
      startTime: new Date(),
      bookId: this.ebookReader.currentBook ? this.ebookReader.currentBook.id : null,
      initialProgress: this.calculateCurrentProgress(),
      breaks: [],
      focusModeActivations: 0,
      searchCount: 0
    };
    
    // Show toast notification
    this.notificationManager.showToast('Reading session started', 'info');
    
    // Schedule a motivational quote to appear after 5-10 minutes
    this.scheduleRandomQuote();
  }
  
  /**
   * End the current reading session
   */
  endReadingSession() {
    if (!this.currentSession) return;
    
    // Calculate session duration
    const endTime = new Date();
    const sessionDurationMs = endTime - new Date(this.currentSession.startTime);
    const sessionDurationMinutes = Math.round(sessionDurationMs / (1000 * 60));
    
    // Calculate total break time
    let totalBreakTimeMinutes = 0;
    this.currentSession.breaks.forEach(breakSession => {
      const breakDurationMs = new Date(breakSession.endTime) - new Date(breakSession.startTime);
      totalBreakTimeMinutes += Math.round(breakDurationMs / (1000 * 60));
    });
    
    // Calculate effective reading time
    const effectiveReadingMinutes = Math.max(0, sessionDurationMinutes - totalBreakTimeMinutes);
    
    // Calculate progress made during session
    const finalProgress = this.calculateCurrentProgress();
    const progressMade = finalProgress - this.currentSession.initialProgress;
    
    // Record the completed session
    const completedSession = {
      ...this.currentSession,
      endTime,
      duration: sessionDurationMinutes,
      effectiveReadingTime: effectiveReadingMinutes,
      progressMade: progressMade
    };
    
    // Add to reading sessions history
    this.readingSessions.push(completedSession);
    
    // Trim the sessions history if it gets too long
    if (this.readingSessions.length > 100) {
      this.readingSessions = this.readingSessions.slice(-100);
    }
    
    // Update reading statistics
    this.updateReadingStats(completedSession);
    
    // Save to localStorage
    localStorage.setItem('ebook-sessions', JSON.stringify(this.readingSessions));
    
    // Reset current session
    this.currentSession = null;
    
    // Show toast with session summary
    this.notificationManager.showToast(
      `Reading session completed: ${effectiveReadingMinutes} minutes of focused reading`, 
      'success'
    );
    
    // Show achievement if they read for a significant amount of time
    if (effectiveReadingMinutes >= 15) {
      this.checkAndAwardAchievement('reading-time-60', effectiveReadingMinutes);
    }
  }
  
  /**
   * Start a break within the current reading session
   */
  startBreak() {
    if (!this.currentSession) return false;
    
    // Add a break to the current session
    this.currentSession.breaks.push({
      startTime: new Date(),
      endTime: null
    });
    
    return true;
  }
  
  /**
   * End the current break
   */
  endBreak() {
    if (!this.currentSession || !this.currentSession.breaks.length) return false;
    
    // Find the last break that hasn't ended
    const currentBreak = this.currentSession.breaks.findLast(b => !b.endTime);
    if (currentBreak) {
      currentBreak.endTime = new Date();
      return true;
    }
    
    return false;
  }
  
  /**
   * Update reading stats based on a completed session
   * @param {Object} session - The completed reading session
   */
  updateReadingStats(session) {
    // Update total time read
    this.readingStats.totalTimeRead += session.effectiveReadingTime;
    
    // Update sessions completed
    this.readingStats.sessionsCompleted += 1;
    
    // Update today's reading time in the calendar
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    this.readingStats.calendar[today] = (this.readingStats.calendar[today] || 0) + session.effectiveReadingTime;
    
    // Update streak
    this.updateReadingStreak();
    
    // Check if book was completed
    if (session.progressMade > 0 && this.calculateCurrentProgress() >= 98) {
      this.readingStats.booksCompleted += 1;
      this.checkAndAwardAchievement('book-complete', 1);
      this.notificationManager.showToast('Congratulations! You completed the book.', 'success');
    }
    
    // Save stats
    this.saveReadingStats();
  }
  
  /**
   * Update reading streak
   */
  updateReadingStreak() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // If there was already activity recorded today, no need to update streak
    if (this.readingStats.calendar[today] && this.readingStats.streaks.lastReadDate === today) {
      return;
    }
    
    // Check if the last read date was yesterday
    let yesterdayStreakContinued = false;
    if (this.readingStats.streaks.lastReadDate) {
      const lastDate = new Date(this.readingStats.streaks.lastReadDate + 'T00:00:00');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        yesterdayStreakContinued = true;
      }
    }
    
    // Update streak
    if (yesterdayStreakContinued || !this.readingStats.streaks.current) {
      // Continue or start streak
      this.readingStats.streaks.current += 1;
      
      // Check for achievements
      if (this.readingStats.streaks.current >= 3) {
        this.checkAndAwardAchievement('reading-streak-3', this.readingStats.streaks.current);
      }
      if (this.readingStats.streaks.current >= 7) {
        this.checkAndAwardAchievement('reading-streak-7', this.readingStats.streaks.current);
      }
    } else {
      // Reset streak
      this.readingStats.streaks.current = 1;
    }
    
    // Update longest streak if current is longer
    if (this.readingStats.streaks.current > this.readingStats.streaks.longest) {
      this.readingStats.streaks.longest = this.readingStats.streaks.current;
    }
    
    // Update last read date
    this.readingStats.streaks.lastReadDate = today;
  }
  
  /**
   * Check if an achievement should be awarded and award it
   * @param {string} achievementId - ID of the achievement
   * @param {number} progress - Current progress toward the achievement
   */
  checkAndAwardAchievement(achievementId, progress) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Update progress
    if (!achievement.unlocked) {
      achievement.progress = Math.min(achievement.target, achievement.progress + progress);
      
      // Check if achievement is now completed
      if (achievement.progress >= achievement.target) {
        achievement.unlocked = true;
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
      }
      
      this.saveAchievements();
    }
  }
  
  /**
   * Show achievement notification
   * @param {Object} achievement - The achievement to display
   */
  showAchievementNotification(achievement) {
    // Create achievement modal with bounce-in animation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    // Create achievement content with vite-style animation
    const content = document.createElement('div');
    content.className = 'bg-gradient-to-br from-indigo-100 to-white p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-bounce-in text-center';
    content.innerHTML = `
      <div class="achievement-icon text-5xl mb-4 animate-pulse-slow">${achievement.icon}</div>
      <h3 class="text-2xl font-bold gradient-text mb-2">Achievement Unlocked!</h3>
      <h4 class="text-xl font-semibold text-indigo-700 mb-4">${achievement.title}</h4>
      <p class="mb-3 text-gray-700">${achievement.description}</p>
      ${achievement.reward ? `<p class="font-semibold text-green-700 mb-4">Reward: ${achievement.reward}</p>` : ''}
      <button class="close-modal bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors mt-2">
        Continue Reading
      </button>
    `;
    
    modal.appendChild(content);
    
    // Add event listener to close button
    content.querySelector('.close-modal').addEventListener('click', () => {
      modal.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });
    
    // Add to page
    document.body.appendChild(modal);
    
    // Play achievement sound if available
    const achievementSound = new Audio('/src/assets/achievement.mp3');
    achievementSound.volume = 0.5;
    achievementSound.play().catch(err => console.log('Audio play prevented by browser policy.'));
  }
  
  /**
   * Schedule a random motivational quote to appear
   */
  scheduleRandomQuote() {
    // Don't schedule if we just showed one recently
    const now = Date.now();
    if (now - this.lastQuoteTime < 5 * 60 * 1000) return; // At least 5 min between quotes
    
    // Schedule a quote to appear after 5-10 minutes
    const delay = Math.random() * (10 - 5) * 60 * 1000 + 5 * 60 * 1000;
    setTimeout(() => {
      // Only show if we're still in a reading session
      if (this.currentSession) {
        this.showMotivationalQuote();
        this.lastQuoteTime = Date.now();
        // Schedule another quote
        this.scheduleRandomQuote();
      }
    }, delay);
  }
  
  /**
   * Show a motivational quote
   */
  showMotivationalQuote() {
    // Get a random quote
    const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    
    // Create a non-intrusive floating element
    const quoteElement = document.createElement('div');
    quoteElement.className = 'fixed bottom-5 right-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg shadow-lg max-w-sm animate-fade-in z-40';
    quoteElement.innerHTML = `
      <p class="italic">${quote}</p>
      <div class="mt-2 text-right">
        <button class="text-xs text-white/80 hover:text-white">Close</button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(quoteElement);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(quoteElement)) {
        quoteElement.classList.add('animate-fade-out');
        setTimeout(() => {
          if (document.body.contains(quoteElement)) {
            document.body.removeChild(quoteElement);
          }
        }, 500);
      }
    }, 10000);
    
    // Add event listener to close button
    quoteElement.querySelector('button').addEventListener('click', () => {
      quoteElement.classList.add('animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(quoteElement)) {
          document.body.removeChild(quoteElement);
        }
      }, 500);
    });
  }
  
  /**
   * Update the reading stats UI
   */
  updateReadingStatsUI() {
    const statsContainer = document.getElementById('reading-stats-container');
    if (!statsContainer) return;
    
    // Create a more engaging stats display with animations
    let totalTimeRead = this.readingStats.totalTimeRead || 0;
    const booksStarted = this.userProgress.length;
    const booksCompleted = this.userProgress.filter(p => p.percent >= 100).length;
    
    // Format reading time
    const hours = Math.floor(totalTimeRead / 60);
    const minutes = totalTimeRead % 60;
    const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Get a random motivational quote
    const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    
    statsContainer.innerHTML = `
      <div class="mb-10 vite-section">
        <h3 class="text-xl font-bold text-indigo-900 mb-4">Reading Insights</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-fade-in">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 spotlight-card">
            <div class="flex flex-col">
              <h4 class="text-sm uppercase text-gray-500 tracking-wide mb-4">Reading Summary</h4>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p class="text-3xl font-bold gradient-text">${timeString}</p>
                  <p class="text-xs text-gray-500">Total Reading Time</p>
                </div>
                <div>
                  <p class="text-3xl font-bold gradient-text">${booksStarted}</p>
                  <p class="text-xs text-gray-500">Books Started</p>
                </div>
                <div>
                  <p class="text-3xl font-bold gradient-text">${booksCompleted}</p>
                  <p class="text-xs text-gray-500">Books Completed</p>
                </div>
              </div>
              
              <div class="text-sm text-gray-600 italic border-l-4 border-indigo-200 pl-3 py-1">
                "${randomQuote}"
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 spotlight-card">
            <h4 class="text-sm uppercase text-gray-500 tracking-wide mb-4">Reading Goals</h4>
            
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium">Daily Reading Time</span>
                  <span>${this.readingStats.dailyTimeRead || 0}/${this.readingStats.goals?.dailyMinutes || 20} minutes</span>
                </div>
                <div class="reading-progress-bar">
                  <div class="reading-progress-value ${(this.readingStats.dailyTimeRead || 0) > 0 ? 'progress-pulse' : ''}" 
                       style="width: ${Math.min(100, ((this.readingStats.dailyTimeRead || 0) / (this.readingStats.goals?.dailyMinutes || 20)) * 100)}%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium">Weekly Books</span>
                  <span>${this.readingStats.weeklyBooksRead || 0}/${this.readingStats.goals?.weeklyBooks || 1} books</span>
                </div>
                <div class="reading-progress-bar">
                  <div class="reading-progress-value ${(this.readingStats.weeklyBooksRead || 0) > 0 ? 'progress-pulse' : ''}" 
                       style="width: ${Math.min(100, ((this.readingStats.weeklyBooksRead || 0) / (this.readingStats.goals?.weeklyBooks || 1)) * 100)}%"></div>
                </div>
              </div>
              
              <div class="mt-6 flex justify-between items-center">
                <span class="text-sm text-indigo-600 font-medium">Current streak: 
                  <span class="text-indigo-700 font-bold">${this.readingStats.streaks?.current || 0} days</span>
                </span>
                ${this.readingStats.streaks?.current > 0 ? 
                  `<div class="flex items-center">
                    <span class="text-amber-600 text-lg mr-1 icon-pulse">🔥</span>
                    <span class="text-sm font-medium text-amber-600">${this.readingStats.streaks?.current}</span>
                  </div>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Initialize spotlight effect on the new cards
    if (this.animationManager) {
      this.animationManager.setupSpotlightEffect();
      
      // Observe the main section for animations
      const section = statsContainer.querySelector('.vite-section');
      if (section) {
        this.animationManager.observeElement(section);
      }
    } else {
      // If animation manager isn't loaded yet, just show the section
      const section = statsContainer.querySelector('.vite-section');
      if (section) {
        section.classList.add('loaded');
      }
    }
  }
}
