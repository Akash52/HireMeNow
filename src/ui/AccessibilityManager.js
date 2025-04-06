/**
 * Accessibility Manager handles features like keyboard navigation, screen readers
 */
export class AccessibilityManager {
  constructor(baseUIManager) {
    this.baseUI = baseUIManager;
    this.isBeeping = false;
  }

  initAccessibility() {
    // Add ARIA attributes to improve screen reader experience
    if (this.baseUI.optionsContainer) {
      this.baseUI.optionsContainer.setAttribute('role', 'radiogroup');
      this.baseUI.optionsContainer.setAttribute('aria-labelledby', 'question-text');
    }

    // Add focus trap for modal dialogs
    if (this.baseUI.resumeDialog) {
      this.baseUI.resumeDialog.setAttribute('role', 'dialog');
      this.baseUI.resumeDialog.setAttribute('aria-modal', 'true');
    }
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Number keys 1-4 for selecting options
      if (this.baseUI.questionScreen && !this.baseUI.questionScreen.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          const options = this.baseUI.optionsContainer.querySelectorAll('button:not([disabled])');
          if (options.length >= num) {
            options[num - 1].click();
          }
        }
      }

      // Space bar to start/pause/resume
      if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        if (!this.baseUI.questionScreen.classList.contains('hidden') && this.baseUI.pauseButton) {
          this.baseUI.pauseButton.click();
        } else if (
          !this.baseUI.startScreen.classList.contains('hidden') &&
          !this.baseUI.startButton.disabled
        ) {
          this.baseUI.startButton.click();
        }
      }

      // Escape key to pause
      if (
        e.code === 'Escape' &&
        !this.baseUI.questionScreen.classList.contains('hidden') &&
        this.baseUI.pauseButton
      ) {
        if (this.baseUI.pauseButton.dataset.state === 'running') {
          this.baseUI.pauseButton.click();
        }
      }
    });
  }

  initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 100;
    const swipeDistance = endX - startX;

    // Only handle swipes if we're in the question screen
    if (this.baseUI.questionScreen && !this.baseUI.questionScreen.classList.contains('hidden')) {
      if (swipeDistance < -swipeThreshold && this.baseUI.isExplanationShown) {
        // Left swipe - show explanation if question has been answered
        if (this.baseUI.currentExplanation) {
          this.baseUI.showExplanation(this.baseUI.currentExplanation);
        }
      }
    }
  }

  playTimerSound() {
    // Create audio context if supported
    if (window.AudioContext || window.webkitAudioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();

      // Create oscillator for beep sound
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    }
  }
}
