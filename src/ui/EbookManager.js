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
    
    let html = '';
    
    this.catalog.forEach(book => {
      const progress = this.getUserProgressForBook(book.id);
      const progressPercent = progress ? Math.round(progress.percent) : 0;
      
      html += `
        <div class="ebook-card p-4 bg-white rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
          <div class="aspect-w-2 aspect-h-3 mb-3 bg-gray-100 rounded overflow-hidden">
            <img 
              src="${book.cover || 'https://i.ibb.co/wNWP732H/default-book-cover.jpg'}" 
              alt="Cover of ${book.title}"
              class="object-cover w-full h-full"
              onerror="this.src='https://i.ibb.co/wNWP732H/default-book-cover.jpg'"
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
    // Create achievement modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    // Create achievement content
    const content = document.createElement('div');
    content.className = 'bg-gradient-to-br from-indigo-100 to-white p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-bounce-in text-center';
    content.innerHTML = `
      <div class="achievement-icon text-5xl mb-4">${achievement.icon}</div>
      <h3 class="text-2xl font-bold text-indigo-900 mb-2">Achievement Unlocked!</h3>
      <h4 class="text-xl font-semibold text-indigo-700 mb-4">${achievement.title}</h4>
      <p class="mb-3 text-gray-700">${achievement.description}</p>
      ${achievement.reward ? `<p class="font-semibold text-green-700 mb-4">Reward: ${achievement.reward}</p>` : ''}
      <button class="close-modal bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
        Continue Reading
      </button>
    `;
    
    modal.appendChild(content);
    
    // Add event listener to close button
    content.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
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
    
    const today = new Date().toISOString().split('T')[0];
    const todaysReading = this.readingStats.calendar[today] || 0;
    const goalProgress = Math.min(100, Math.round((todaysReading / this.readingStats.goals.dailyMinutes) * 100));
    
    statsContainer.innerHTML = `
      <div class="stats-card p-4 bg-white rounded-xl shadow-md border border-gray-100 mb-4">
        <h3 class="font-bold text-indigo-900 mb-3">Reading Stats</h3>
        
        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span>Daily Goal (${this.readingStats.goals.dailyMinutes} min)</span>
            <span>${todaysReading} min</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-indigo-600 h-2 rounded-full" style="width: ${goalProgress}%"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div class="text-center p-2 bg-indigo-50 rounded">
            <div class="text-2xl font-bold text-indigo-700">${this.readingStats.streaks.current}</div>
            <div class="text-xs text-gray-600">Day Streak</div>
          </div>
          <div class="text-center p-2 bg-indigo-50 rounded">
            <div class="text-2xl font-bold text-indigo-700">${Math.round(this.readingStats.totalTimeRead / 60)}</div>
            <div class="text-xs text-gray-600">Hours Read</div>
          </div>
          <div class="text-center p-2 bg-indigo-50 rounded">
            <div class="text-2xl font-bold text-indigo-700">${this.readingStats.booksCompleted}</div>
            <div class="text-xs text-gray-600">Completed</div>
          </div>
        </div>
        
        <button id="view-reading-insights" class="w-full py-2 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors text-sm font-medium">
          View Insights
        </button>
      </div>
      
      <div class="stats-card p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 class="font-bold text-indigo-900 mb-2">Reading Calendar</h3>
        <div id="reading-calendar" class="calendar-heatmap text-center text-xs"></div>
      </div>
    `;
    
    // Initialize calendar heatmap
    this.renderReadingCalendar();
    
    // Add event listener for insights button
    document.getElementById('view-reading-insights').addEventListener('click', () => {
      this.showReadingInsights();
    });
  }
  
  /**
   * Render the reading calendar heatmap
   */
  renderReadingCalendar() {
    const calendarContainer = document.getElementById('reading-calendar');
    if (!calendarContainer) return;
    
    // Get data for the last 30 days
    const today = new Date();
    const calendar = this.readingStats.calendar;
    let html = '<div class="grid grid-cols-7 gap-1">';
    
    // Add day headers
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 0; i < 7; i++) {
      html += `<div class="text-gray-500">${days[i]}</div>`;
    }
    
    // Get the date 30 days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Fill in blank days at the beginning to align with weekdays
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
      html += '<div class="h-6"></div>';
    }
    
    // Add days with heat coloring
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const minutes = calendar[dateStr] || 0;
      
      let colorClass = 'bg-gray-100'; // No reading
      
      if (minutes > 0) {
        if (minutes >= this.readingStats.goals.dailyMinutes) {
          colorClass = 'bg-green-500'; // Goal met
        } else if (minutes >= this.readingStats.goals.dailyMinutes / 2) {
          colorClass = 'bg-green-300'; // Good progress
        } else {
          colorClass = 'bg-green-100'; // Some reading
        }
      }
      
      // Highlight today
      const isToday = dateStr === today.toISOString().split('T')[0];
      const borderClass = isToday ? 'ring-2 ring-indigo-500' : '';
      
      html += `
        <div class="h-6 rounded ${colorClass} ${borderClass}" 
             title="${dateStr}: ${minutes} minutes">
        </div>
      `;
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
  }
  
  /**
   * Show reading insights modal
   */
  showReadingInsights() {
    // Create insights modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    // Calculate insights
    const totalSessions = this.readingStats.sessionsCompleted;
    const averageSessionMinutes = totalSessions > 0 
      ? Math.round(this.readingStats.totalTimeRead / totalSessions) 
      : 0;
    const bestReadingStreak = this.readingStats.streaks.longest;
    const booksCompleted = this.readingStats.booksCompleted;
    const totalReadingHours = Math.round(this.readingStats.totalTimeRead / 60 * 10) / 10;
    
    // Get top reading days
    const calendar = this.readingStats.calendar;
    const topDays = Object.entries(calendar)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    // Create insights content
    const content = document.createElement('div');
    content.className = 'bg-white p-6 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto';
    content.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-indigo-900">Your Reading Insights</h2>
        <button class="close-modal text-gray-500 hover:text-gray-800">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="mb-5">
        <h3 class="font-semibold text-lg text-indigo-800 mb-2">Reading Summary</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-50 p-3 rounded-lg">
            <div class="text-3xl font-bold text-indigo-800">${totalReadingHours}</div>
            <div class="text-sm text-gray-600">Total Hours</div>
          </div>
          <div class="bg-indigo-50 p-3 rounded-lg">
            <div class="text-3xl font-bold text-indigo-800">${booksCompleted}</div>
            <div class="text-sm text-gray-600">Books Completed</div>
          </div>
          <div class="bg-indigo-50 p-3 rounded-lg">
            <div class="text-3xl font-bold text-indigo-800">${bestReadingStreak}</div>
            <div class="text-sm text-gray-600">Best Streak (Days)</div>
          </div>
          <div class="bg-indigo-50 p-3 rounded-lg">
            <div class="text-3xl font-bold text-indigo-800">${averageSessionMinutes}</div>
            <div class="text-sm text-gray-600">Avg. Session (min)</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h3 class="font-semibold text-lg text-indigo-800 mb-2">Your Top Reading Days</h3>
        <div class="space-y-2">
          ${topDays.map(([date, minutes]) => {
            const formattedDate = new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            });
            return `
              <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span class="font-medium">${formattedDate}</span>
                <span class="text-indigo-700 font-semibold">${minutes} minutes</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="mb-5">
        <h3 class="font-semibold text-lg text-indigo-800 mb-2">Achievements</h3>
        <div class="grid grid-cols-2 gap-3">
          ${this.achievements
            .filter(a => a.unlocked)
            .map(a => `
              <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg flex items-center space-x-3 border border-indigo-100">
                <div class="text-2xl">${a.icon}</div>
                <div>
                  <div class="font-semibold text-indigo-800">${a.title}</div>
                  <div class="text-xs text-gray-600">${a.description}</div>
                </div>
              </div>
            `).join('')}
        </div>
        ${this.achievements.filter(a => a.unlocked).length === 0 ? 
          '<p class="text-gray-500 text-center my-4">No achievements unlocked yet. Keep reading!</p>' : ''}
      </div>
      
      <div>
        <h3 class="font-semibold text-lg text-indigo-800 mb-2">Reading Goals</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span>Daily Reading Goal</span>
              <span id="daily-goal-value">${this.readingStats.goals.dailyMinutes} min</span>
            </div>
            <input type="range" id="daily-goal-slider" min="5" max="120" step="5" 
                   value="${this.readingStats.goals.dailyMinutes}" 
                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
          </div>
          
          <button id="save-goals" class="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium">
            Save Goals
          </button>
        </div>
      </div>
    `;
    
    modal.appendChild(content);
    
    // Add to page
    document.body.appendChild(modal);
    
    // Add event listeners
    content.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Slider for daily goal
    const dailyGoalSlider = document.getElementById('daily-goal-slider');
    const dailyGoalValue = document.getElementById('daily-goal-value');
    
    dailyGoalSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      dailyGoalValue.textContent = `${value} min`;
    });
    
    // Save goals button
    document.getElementById('save-goals').addEventListener('click', () => {
      this.readingStats.goals.dailyMinutes = parseInt(dailyGoalSlider.value);
      this.saveReadingStats();
      document.body.removeChild(modal);
      this.notificationManager.showToast('Reading goals updated', 'success');
    });
  }
}
