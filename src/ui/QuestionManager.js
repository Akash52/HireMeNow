/**
 * Question Manager handles all question-related UI operations
 */
export class QuestionManager {
  constructor(baseUIManager, animationManager) {
    this.baseUI = baseUIManager;
    this.animationManager = animationManager;
  }

  setQuestionText(text) {
    if (!this.baseUI.questionText) return;

    // Add fade effect when changing question text
    this.baseUI.questionText.classList.add('fade-out');

    setTimeout(() => {
      this.baseUI.questionText.innerHTML = text;
      this.baseUI.questionText.classList.remove('fade-out');
      this.baseUI.questionText.classList.add('fade-in');

      setTimeout(() => {
        this.baseUI.questionText.classList.remove('fade-in');
      }, 300);
    }, 300);
  }

  renderOptions(options, onSelect) {
    if (!this.baseUI.optionsContainer) return;

    // Hide any visible explanation first
    this.hideExplanation();

    // Clear existing options with fade effect
    const existingOptions = this.baseUI.optionsContainer.querySelectorAll('.option-btn');
    if (existingOptions.length > 0) {
      existingOptions.forEach((btn) => btn.classList.add('fade-out'));

      setTimeout(() => {
        this.baseUI.optionsContainer.innerHTML = '';
        this.renderNewOptions(options, onSelect);
      }, 300);
    } else {
      this.renderNewOptions(options, onSelect);
    }

    // Reset explanation state for new question
    this.baseUI.isExplanationShown = false;
    // Clear any stored explanation
    this.baseUI.currentExplanation = null;
  }

  renderNewOptions(options, onSelect) {
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn fade-in';
      button.innerHTML = option;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');
      button.setAttribute('data-index', index);
      button.setAttribute('aria-label', `Option ${index + 1}: ${this.baseUI.stripHtml(option)}`);

      button.addEventListener('click', () => {
        this.animationManager.animateButton(button);
        onSelect(index);
      });

      this.baseUI.optionsContainer.appendChild(button);

      // Remove fade-in class after animation completes
      setTimeout(() => {
        button.classList.remove('fade-in');
      }, 300);
    });
  }

  showAnswerFeedback(selectedIndex, correctIndex) {
    if (!this.baseUI.optionsContainer) return;

    const optionButtons = this.baseUI.optionsContainer.querySelectorAll('button');
    if (!optionButtons.length) return;

    optionButtons.forEach((button, index) => {
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');

      if (index === correctIndex) {
        button.classList.add('correct-answer');
        button.setAttribute('aria-checked', index === selectedIndex ? 'true' : 'false');
      }

      if (index === selectedIndex && selectedIndex !== correctIndex) {
        button.classList.add('incorrect-answer');
        button.setAttribute('aria-checked', 'true');
      }
    });

    // Set flag that current question has been answered
    this.baseUI.isExplanationShown = true;

    // Announce result for screen readers
    const isCorrect = selectedIndex === correctIndex;
    this.baseUI.announceForScreenReader(
      isCorrect
        ? 'Correct answer!'
        : `Incorrect answer. The correct answer is: ${this.baseUI.stripHtml(
            optionButtons[correctIndex].innerHTML
          )}`
    );
  }

  showExplanation(explanation) {
    // Store current explanation for potential later use
    this.baseUI.currentExplanation = explanation;

    // Only show explanation if current question has been answered
    if (
      this.baseUI.isExplanationShown &&
      this.baseUI.explanationContainer &&
      this.baseUI.explanationText
    ) {
      // Only actually show the explanation if we have a container and text element
      this.baseUI.explanationText.innerHTML = explanation;

      // Add fade-in effect
      this.baseUI.explanationContainer.classList.add('fade-in');
      this.baseUI.explanationContainer.classList.remove('hidden');

      setTimeout(() => {
        this.baseUI.explanationContainer.classList.remove('fade-in');
      }, 300);

      // Scroll to explanation
      this.baseUI.explanationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Announce for screen readers
      this.baseUI.announceForScreenReader(`Explanation: ${this.baseUI.stripHtml(explanation)}`);
    }
  }

  hideExplanation() {
    if (this.baseUI.explanationContainer) {
      // Add fade-out effect
      this.baseUI.explanationContainer.classList.add('fade-out');

      setTimeout(() => {
        this.baseUI.explanationContainer.classList.add('hidden');
        this.baseUI.explanationContainer.classList.remove('fade-out');

        // Clear explanation content when hidden
        if (this.baseUI.explanationText) {
          this.baseUI.explanationText.innerHTML = '';
        }
      }, 300);
    }

    this.baseUI.isExplanationShown = false;
    this.baseUI.currentExplanation = null;
  }

  updateProgress(current, total, percentage) {
    if (this.baseUI.questionNumber) {
      this.baseUI.questionNumber.textContent = `Question ${current} of ${total}`;
    }

    if (this.baseUI.progressPercent) {
      this.baseUI.progressPercent.textContent = `${Math.round(percentage)}% Complete`;
    }

    if (this.baseUI.progressBar) {
      // Animate the progress bar
      const currentWidth = parseFloat(this.baseUI.progressBar.style.width) || 0;
      this.animationManager.animateProgressBar(this.baseUI.progressBar, currentWidth, percentage);
    }

    // Announce progress for screen readers
    this.baseUI.announceForScreenReader(
      `Question ${current} of ${total}, ${Math.round(percentage)}% complete`
    );
  }

  updateTimer(seconds, accessibilityManager) {
    if (!this.baseUI.timerDisplay) return;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Display in MM:SS format for better readability
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

    // Only update DOM if the value has changed
    if (this.baseUI.timerDisplay.textContent !== formattedTime) {
      this.baseUI.timerDisplay.textContent = formattedTime;

      // Apply warning styles when time is running low
      if (seconds <= 5) {
        this.baseUI.timerDisplay.classList.add('text-red-600', 'animate-pulse');

        // Add beep sound for last 5 seconds if not already beeping
        if (accessibilityManager && !accessibilityManager.isBeeping && seconds > 0) {
          accessibilityManager.isBeeping = true;
          accessibilityManager.playTimerSound();
        }
      } else if (seconds <= 10) {
        this.baseUI.timerDisplay.classList.add('text-orange-500');
        this.baseUI.timerDisplay.classList.remove('text-red-600', 'animate-pulse');
        if (accessibilityManager) {
          accessibilityManager.isBeeping = false;
        }
      } else {
        this.baseUI.timerDisplay.classList.remove(
          'text-red-600',
          'text-orange-500',
          'animate-pulse'
        );
        if (accessibilityManager) {
          accessibilityManager.isBeeping = false;
        }
      }

      // Announce time for screen readers at specific intervals
      if (seconds === 30 || seconds === 15 || seconds === 10 || seconds === 5) {
        this.baseUI.announceForScreenReader(`${seconds} seconds remaining`);
      }
    }
  }

  showTimeWarning(secondsLeft) {
    // Visual warning
    if (this.baseUI.timerDisplay) {
      this.baseUI.timerDisplay.classList.add('warning-flash');
      setTimeout(() => {
        if (this.baseUI.timerDisplay) {
          this.baseUI.timerDisplay.classList.remove('warning-flash');
        }
      }, 1000);
    }

    // Announce time warning for screen readers
    this.baseUI.announceForScreenReader(`Warning: ${secondsLeft} seconds remaining`);
  }
}
