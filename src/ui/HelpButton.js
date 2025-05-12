/**
 * HelpButton creates and manages a floating help button
 * Simplified version without Driver.js dependency
 */
export class HelpButton {
  constructor(tourManager) {
    this.tourManager = tourManager;
    this.initialized = false;
  }
  
  /**
   * Initialize the help button
   */
  init() {
    if (this.initialized) return;
    
    try {
      this.createHelpButton();
      this.attachEventListeners();
      this.initialized = true;
      console.log('Help button initialized successfully');
    } catch (error) {
      console.error('Failed to initialize help button:', error);
    }
  }
  
  /**
   * Create the floating help button if it doesn't exist
   */
  createHelpButton() {
    if (!document.getElementById('floating-help-button')) {
      const button = document.createElement('button');
      button.id = 'floating-help-button';
      button.className = 'fixed bottom-5 right-5 bg-indigo-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center';
      button.setAttribute('aria-label', 'Show help');
      button.innerHTML = '<i class="fas fa-question"></i>';
      document.body.appendChild(button);
    }
  }
  
  /**
   * Attach event listeners to the help button
   */
  attachEventListeners() {
    const helpButton = document.getElementById('floating-help-button');
    if (!helpButton) return;
    
    // Start help on click
    helpButton.addEventListener('click', () => {
      try {
        if (this.tourManager) {
          console.log('Showing help via TourManager');
          this.tourManager.startMainTour();
        } else if (window.uiManager) {
          // Fallback to UIManager
          console.log('Showing help via UIManager (fallback)');
          window.uiManager.showSimpleHelp();
        } else {
          console.error('No help manager available');
          alert('Help functionality is currently unavailable.');
        }
      } catch (error) {
        console.error('Error showing help:', error);
      }
    });
  }
}
