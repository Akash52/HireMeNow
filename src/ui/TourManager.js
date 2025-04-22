/**
 * Tour Manager handles application tours and help functionality
 * Simplified version without Driver.js dependency
 */
export class TourManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.activeTour = null;
    this.isTourActive = false;
    this.lastRoute = null;
    this.tourHistory = new Map(); // Track which tours user has seen
    
    console.log('TourManager initialized with UIManager');
  }
  
  /**
   * Initialize the tour manager
   */
  init() {
    this.attachEventListeners();
    this.loadTourState();
    console.log('TourManager event listeners attached');
  }
  
  /**
   * Attach event listeners for tour functionality
   */
  attachEventListeners() {
    // Listen for tab changes to manage tours
    document.addEventListener('click', (e) => {
      const navButton = e.target.closest('.nav-btn');
      if (navButton && this.activeTour) {
        const targetSection = navButton.getAttribute('aria-controls');
        
        // End current tour
        this.cleanupActiveTour();
      }
    });
    
    // Attach help icon click handler
    const helpIcon = document.getElementById('help-icon');
    if (helpIcon) {
      helpIcon.addEventListener('click', () => {
        this.startMainTour();
      });
    }
  }
  
  /**
   * Start the main application tour (simplified to use UIManager's help)
   */
  startMainTour() {
    if (this.uiManager && typeof this.uiManager.showSimpleHelp === 'function') {
      this.uiManager.showSimpleHelp();
      this.isTourActive = true;
    }
  }
  
  /**
   * Get the currently active section ID
   */
  getActiveSection() {
    const containers = [
      'quiz-container',
      'interview-container',
      'ebook-container'
    ];
    
    for (const id of containers) {
      const container = document.getElementById(id);
      if (container && !container.classList.contains('hidden')) {
        return id;
      }
    }
    
    return 'quiz-container'; // Default
  }
  
  /**
   * Start a tour for a specific section (simplified)
   */
  startSectionTour(sectionId) {
    if (this.uiManager) {
      this.uiManager.showSimpleHelp();
      this.isTourActive = true;
    }
  }
  
  /**
   * Clean up any active tour
   */
  cleanupActiveTour() {
    this.activeTour = null;
    this.isTourActive = false;
  }
  
  /**
   * Show help for a specific element (simplified)
   */
  showElementHelp(elementId) {
    if (this.uiManager && typeof this.uiManager.showElementHelp === 'function') {
      this.uiManager.showElementHelp(elementId);
    }
  }
  
  /**
   * Save tour state to localStorage
   */
  saveTourState() {
    try {
      localStorage.setItem('tour-state', JSON.stringify({
        lastRoute: this.lastRoute,
        tourHistory: Array.from(this.tourHistory.entries())
      }));
    } catch (e) {
      console.warn('Could not save tour state:', e);
    }
  }
  
  /**
   * Load tour state from localStorage
   */
  loadTourState() {
    try {
      const savedState = localStorage.getItem('tour-state');
      if (savedState) {
        const { lastRoute, tourHistory } = JSON.parse(savedState);
        this.lastRoute = lastRoute;
        this.tourHistory = new Map(tourHistory);
      }
    } catch (e) {
      console.warn('Could not load tour state:', e);
    }
  }
}
