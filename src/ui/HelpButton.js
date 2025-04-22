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
    // Check if button already exists
    if (document.getElementById('floating-help-button')) return;
    
    // Create floating help button
    const helpButton = document.createElement('button');
    helpButton.id = 'floating-help-button';
    helpButton.className = 'fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-50';
    helpButton.setAttribute('aria-label', 'Get help');
    helpButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    `;
    
    // Add to the DOM
    document.body.appendChild(helpButton);
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
