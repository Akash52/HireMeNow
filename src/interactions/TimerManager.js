export class TimerManager {
  constructor(timePerQuestion, uiManager, callbacks) {
    this.timePerQuestion = timePerQuestion;
    this.timeRemaining = timePerQuestion;
    this.uiManager = uiManager;
    this.timer = null;
    this.isPaused = false;
    this.callbacks = callbacks || {};
    this.lastTickTime = null; // For tracking elapsed time between ticks
  }

  startTimer() {
    if (this.timer) {
      this.stopTimer();
    }

    this.timeRemaining = this.timeRemaining || this.timePerQuestion;
    this.uiManager.updateTimer(this.timeRemaining);
    this.uiManager.updatePauseButton(this.isPaused);
    this.lastTickTime = Date.now();

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        // Calculate actual elapsed time since last tick (for browser throttling issues)
        const now = Date.now();
        const elapsed = Math.floor((now - this.lastTickTime) / 1000);
        this.lastTickTime = now;

        // Decrement by actual elapsed time (minimum 1 second)
        const decrementBy = Math.max(1, elapsed);
        this.timeRemaining = Math.max(0, this.timeRemaining - decrementBy);

        this.uiManager.updateTimer(this.timeRemaining);

        // Warning when time is running low (20% of total time)
        const warningThreshold = Math.floor(this.timePerQuestion * 0.2);
        if (this.timeRemaining === warningThreshold) {
          this.uiManager.showTimeWarning(this.timeRemaining);
        }

        if (this.timeRemaining <= 0) {
          this.stopTimer();
          // Only auto-submit if not paused
          if (this.callbacks.onTimeUp && !this.isPaused) {
            this.callbacks.onTimeUp();
          }
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  pauseTimer() {
    this.isPaused = true;
    this.uiManager.updatePauseButton(true);
    this.uiManager.showToast('Quiz paused', 'info');

    if (this.callbacks.onPause) {
      this.callbacks.onPause();
    }

    if (this.callbacks.updateState) {
      this.callbacks.updateState();
    }
  }

  resumeTimer() {
    this.isPaused = false;
    // Reset the last tick time when resuming to prevent time jumps
    this.lastTickTime = Date.now();
    this.uiManager.updatePauseButton(false);
    this.uiManager.showToast('Quiz resumed', 'info');

    if (this.callbacks.onResume) {
      this.callbacks.onResume();
    }

    if (this.callbacks.updateState) {
      this.callbacks.updateState();
    }
  }

  resetTimer() {
    this.stopTimer();
    this.isPaused = false; // Reset pause state when moving to a new question
    this.timeRemaining = this.timePerQuestion;
    this.startTimer();
  }
}
