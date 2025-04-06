/**
 * Notification Manager handles toasts, alerts and user feedback
 */
class NotificationManager {
  constructor(toastContainer) {
    this.toastContainer = toastContainer;

    // Add Tailwind CSS classes to the toast container
    if (this.toastContainer) {
      this.toastContainer.className =
        'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-xs';
    }
  }

  // Helper functions to replace nested ternaries
  getBorderColorClass(type) {
    if (type === 'success') return 'border-green-500';
    if (type === 'error') return 'border-red-500';
    if (type === 'warning') return 'border-yellow-500';
    return 'border-blue-500';
  }

  getIconColorClass(type) {
    if (type === 'success') return 'text-green-500 bg-green-100';
    if (type === 'error') return 'text-red-500 bg-red-100';
    if (type === 'warning') return 'text-yellow-500 bg-yellow-100';
    return 'text-blue-500 bg-blue-100';
  }

  getIconSvg(type) {
    if (type === 'success') {
      return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
    }
    if (type === 'error') {
      return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
    }
    if (type === 'warning') {
      return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
    }
    return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
  }

  showToast(message, type = 'info', duration = 3000) {
    if (!this.toastContainer) return null;

    const toast = document.createElement('div');
    toast.className = `transform transition-all duration-300 ease-in-out opacity-100 scale-100`;

    toast.innerHTML = `
      <div class="flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg bg-white border-l-4 ${this.getBorderColorClass(type)}">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${this.getIconColorClass(type)}">
          ${this.getIconSvg(type)}
        </div>
        <div class="ml-3 text-sm  text-gray-700 font-semibold">${message}</div>
        <button type="button" class="toast-close ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex items-center justify-center" aria-label="Close notification">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
    `;

    this.toastContainer.appendChild(toast);

    // Add entrance animation
    setTimeout(() => {
      toast.classList.add('translate-x-0');
    }, 10);

    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismissToast(toast);
    });

    // Auto dismiss after duration
    const timeoutId = setTimeout(() => {
      this.dismissToast(toast);
    }, duration);

    // Store timeout ID to allow manual dismissal
    toast.dataset.timeoutId = timeoutId;

    return toast;
  }

  dismissToast(toast) {
    // Clear the timeout if it exists
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId, 10));
    }

    // Add exit animation
    toast.classList.add('opacity-0', 'scale-95');

    // Remove toast after animation completes
    setTimeout(() => {
      if (toast.parentNode === this.toastContainer) {
        this.toastContainer.removeChild(toast);
      }
    }, 300);
  }
}

export default NotificationManager;
