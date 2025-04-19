/**
 * Component to show update notification when a new version of the PWA is available
 */
export class PWAUpdateNotification {
  /**
   * Create a new notification manager
   * @param {Object} uiManager - The UI manager instance for showing notifications
   */
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.registerEvents();
  }
  
  /**
   * Register event listeners for PWA updates
   */
  registerEvents() {
    // Listen for SW update events from the Vite PWA plugin
    document.addEventListener('vite-pwa:updated', (e) => {
      // Show update notification if UI manager is available
      if (this.uiManager && typeof this.uiManager.showToast === 'function') {
        // Create a toast with an update button
        const toast = this.uiManager.createToastElement(
          'New version available! Click to update.',
          'info',
          10000
        );
        
        // Add an update button to the toast
        const updateButton = document.createElement('button');
        updateButton.className = 'ml-2 px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm';
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
          // Reload the page to update to the new version
          e.detail.updateSW();
        });
        
        // Add the button to the toast message
        const messageContainer = toast.querySelector('.toast-message');
        if (messageContainer) {
          messageContainer.appendChild(updateButton);
        }
        
        // Show the custom toast
        this.uiManager.showCustomToast(toast);
      } else {
        // Fallback to confirm dialog if UI manager isn't available
        if (confirm('A new version is available. Update now?')) {
          e.detail.updateSW();
        }
      }
    });
    
    // Listen for SW offline/online events
    window.addEventListener('online', () => {
      if (this.uiManager && typeof this.uiManager.showToast === 'function') {
        this.uiManager.showToast('You are back online', 'success');
      }
    });
    
    window.addEventListener('offline', () => {
      if (this.uiManager && typeof this.uiManager.showToast === 'function') {
        this.uiManager.showToast('You are offline. HireMeNow will continue to work.', 'info');
      }
    });
  }
}
