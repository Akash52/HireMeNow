import { driver } from 'driver.js';
import { BaseUIManager } from './ui/BaseUIManager.js';
import { AnimationManager } from './ui/AnimationManager.js';
import { AccessibilityManager } from './ui/AccessibilityManager.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { QuestionManager } from './ui/QuestionManager.js';
import { ResultManager } from './ui/ResultManager.js';
import { ShareManager } from './ui/ShareManager.js';
import NotificationManager from './ui/NotificationManager.js';
import 'driver.js/dist/driver.css';

/**
 * Main UI Manager that integrates all UI modules
 */
export default class UIManager {
  constructor() {
    // Initialize base UI manager
    this.baseUI = new BaseUIManager();

    // Initialize all other managers
    this.animationManager = new AnimationManager();
    this.notificationManager = new NotificationManager(this.baseUI.toastContainer);
    this.accessibilityManager = new AccessibilityManager(this.baseUI);
    this.themeManager = new ThemeManager();
    this.questionManager = new QuestionManager(this.baseUI, this.animationManager);
    this.resultManager = new ResultManager(this.baseUI, this.animationManager);
    this.shareManager = new ShareManager(this.notificationManager);

    // Initialize the driver instance with common configuration
    this.driverConfig = {
      animate: true,
      opacity: 0.7,
      smoothScroll: true,
      showProgress: true,
      showButtons: ['close', 'next', 'previous'],
    };

    // Initialize features
    this.accessibilityManager.initAccessibility();
    this.accessibilityManager.initKeyboardShortcuts();
    this.accessibilityManager.initTouchGestures();
    this.themeManager.initThemeToggle();
    this.initTours();

    // Initialize state
    this.isExplanationShown = false;
    this.currentExplanation = null;
    this.animationInProgress = false;
    this.isPaused = false;
  }

  // Initialize tour functionality
  initTours() {
    // Bind help icon click to start tour
    const helpIcon = document.getElementById('help-icon');
    if (helpIcon) {
      helpIcon.addEventListener('click', () => {
        this.startMainTour();
      });
    } else {
      console.warn('Help icon not found in the DOM');
    }
  }

  // Main application tour
  startMainTour() {
    // Get the appropriate steps based on current view
    const steps = this.getMainTourSteps();
    // Create a new driver instance with steps and start it immediately
    const driverObj = driver({
      ...this.driverConfig,
      steps,
    });

    // Start the tour
    driverObj.drive();
  }

  // Get tour steps based on current view
  getMainTourSteps() {
    const isQuizView = !this.baseUI.startScreen?.classList.contains('hidden');
    const isQuestionView = !this.baseUI.questionScreen?.classList.contains('hidden');
    const isResultView = !this.baseUI.resultScreen?.classList.contains('hidden');
    const isInterviewView =
      document.getElementById('interview-container')?.classList.contains('hidden') === false;

    if (isQuizView) {
      return this.getQuizSelectionTourSteps();
    }
    if (isQuestionView) {
      return this.getQuestionScreenTourSteps();
    }
    if (isResultView) {
      return this.getResultScreenTourSteps();
    }
    if (isInterviewView) {
      return this.getInterviewPrepTourSteps();
    }
    // Default steps for the application overview
    return this.getApplicationOverviewSteps();
  }

  // Steps for quiz selection screen
  getQuizSelectionTourSteps() {
    return [
      {
        element: '#quiz-container',
        popover: {
          title: 'Welcome to HireMeNow Quiz',
          description: 'This guided tour will help you learn how to use the application.',
          position: 'bottom',
        },
      },
      {
        element: '#js-btn',
        popover: {
          title: 'Select Quiz Topic',
          description: 'Choose the programming language or technology you want to practice.',
          position: 'bottom',
        },
      },
      {
        element: '#difficulty-selection',
        popover: {
          title: 'Choose Difficulty',
          description: 'Select the difficulty level based on your experience.',
          position: 'top',
        },
      },
      {
        element: '#start-button',
        popover: {
          title: 'Start Quiz',
          description: 'Click here to start answering questions!',
          position: 'bottom',
        },
      },
      {
        element: '#nav-interview',
        popover: {
          title: 'Interview Preparation',
          description: 'Switch to interview preparation mode for detailed study materials.',
          position: 'bottom',
        },
      },
    ];
  }

  // Steps for the question screen
  getQuestionScreenTourSteps() {
    return [
      {
        element: '#question-text',
        popover: {
          title: 'Question',
          description: 'Read the question carefully before selecting an answer.',
          position: 'bottom',
        },
      },
      {
        element: '#options-container',
        popover: {
          title: 'Answer Options',
          description:
            'Select the answer you think is correct. You can use keyboard numbers 1-4 to select options.',
          position: 'right',
        },
      },
      {
        element: '#progress-bar',
        popover: {
          title: 'Progress',
          description: 'This shows your progress through the quiz.',
          position: 'bottom',
        },
      },
      {
        element: '#timer-display',
        popover: {
          title: 'Timer',
          description: 'The countdown shows how much time you have left for this question.',
          position: 'left',
        },
      },
      {
        element: '#pause-button',
        popover: {
          title: 'Pause Quiz',
          description: 'You can pause the quiz at any time. Press Space to pause/resume.',
          position: 'left',
        },
      },
    ];
  }

  // Steps for the result screen
  getResultScreenTourSteps() {
    return [
      {
        element: '#result-content',
        popover: {
          title: 'Quiz Results',
          description: 'Here you can see how well you did on the quiz.',
          position: 'top',
        },
      },
      {
        element: '#score-display',
        popover: {
          title: 'Your Score',
          description: 'This shows how many questions you answered correctly.',
          position: 'bottom',
        },
      },
      {
        element: '#performance-analysis',
        popover: {
          title: 'Performance Analysis',
          description: 'Detailed breakdown of your strengths and areas for improvement.',
          position: 'top',
        },
      },
      {
        element: '#review-questions',
        popover: {
          title: 'Question Review',
          description: 'Review all questions with your answers and explanations.',
          position: 'top',
        },
      },
      {
        element: '#share-button',
        popover: {
          title: 'Share Results',
          description: 'Share your results with others!',
          position: 'left',
        },
      },
      {
        element: '#restart-button',
        popover: {
          title: 'Try Again',
          description: 'Take the quiz again to improve your score.',
          position: 'bottom',
        },
      },
      {
        element: '#change-topic-button',
        popover: {
          title: 'Change Topic',
          description: 'Try a different quiz topic or difficulty level.',
          position: 'right',
        },
      },
    ];
  }

  // Steps for the interview prep section
  getInterviewPrepTourSteps() {
    return [
      {
        element: '#interview-container',
        popover: {
          title: 'Interview Preparation',
          description:
            'This section helps you prepare for technical interviews with detailed resources.',
          position: 'top',
        },
      },
      {
        element: '#topic-sidebar',
        popover: {
          title: 'Topics',
          description: 'Browse different interview topics organized by category.',
          position: 'right',
        },
      },
      {
        element: '#search-bar',
        popover: {
          title: 'Search',
          description: 'Search for specific interview questions or topics.',
          position: 'bottom',
        },
      },
      {
        element: '#content-area',
        popover: {
          title: 'Content',
          description: 'Detailed explanations and sample answers for interview questions.',
          position: 'left',
        },
      },
      {
        element: '#nav-quiz',
        popover: {
          title: 'Back to Quiz',
          description: 'Switch back to quiz mode to test your knowledge.',
          position: 'bottom',
        },
      },
    ];
  }

  // General application overview steps
  getApplicationOverviewSteps() {
    return [
      {
        element: 'nav',
        popover: {
          title: 'Navigation',
          description: 'Switch between Quiz mode and Interview Preparation.',
          position: 'bottom',
        },
      },
      {
        element: '#main-content',
        popover: {
          title: 'HireMeNow',
          description:
            'This application helps you prepare for technical interviews through interactive quizzes and study materials.',
          position: 'middle',
        },
      },
      {
        element: '#theme-toggle',
        popover: {
          title: 'Theme Toggle',
          description: 'Switch between light and dark mode for comfortable reading.',
          position: 'left',
        },
      },
    ];
  }

  // Feature-specific tour for quiz functionality
  startQuizFeatureTour() {
    const steps = this.getQuizSelectionTourSteps();
    // Create a new driver instance with steps and start it
    const driverObj = driver({
      ...this.driverConfig,
      steps,
    });

    // Start the tour
    driverObj.drive();
  }

  // Feature-specific tour for interview prep
  startInterviewFeatureTour() {
    const steps = this.getInterviewPrepTourSteps();
    // Create a new driver instance with steps and start it
    const driverObj = driver({
      ...this.driverConfig,
      steps,
    });

    // Start the tour
    driverObj.drive();
  }

  // Context-sensitive help for specific elements
  showElementHelp(elementId) {
    // Create a single-step highlight for a specific element
    const element = document.getElementById(elementId);
    if (!element) return;

    // Get context-specific help text
    const helpInfo = this.getHelpInfoForElement(elementId);

    // Create a new driver instance for just this element
    const driverObj = driver(this.driverConfig);

    // Highlight the element
    driverObj.highlight({
      element: `#${elementId}`,
      popover: {
        title: helpInfo.title,
        description: helpInfo.description,
        position: helpInfo.position || 'auto',
      },
    });
  }

  // Get help text for specific elements
  getHelpInfoForElement(elementId) {
    const helpInfo = {
      'start-button': {
        title: 'Start Quiz',
        description:
          'Click to begin answering questions based on your selected topic and difficulty.',
        position: 'bottom',
      },
      'pause-button': {
        title: 'Pause Quiz',
        description: 'Pause the quiz timer. You can also press the Space bar to pause/resume.',
        position: 'left',
      },
      'timer-display': {
        title: 'Question Timer',
        description:
          'Shows remaining time for the current question. Time varies by difficulty level.',
        position: 'bottom',
      },
      // Add more elements as needed
    };

    return (
      helpInfo[elementId] || {
        title: 'Help',
        description: 'This element helps you navigate the application.',
        position: 'auto',
      }
    );
  }

  // Screen management methods
  showStartScreen() {
    this.animationManager.fadeOut(this.baseUI.questionScreen);
    this.animationManager.fadeOut(this.baseUI.resultScreen);
    this.animationManager.fadeIn(this.baseUI.startScreen);

    // Ensure focus is set for accessibility
    setTimeout(() => {
      if (this.baseUI.startButton) this.baseUI.startButton.focus();
    }, 100);
  }

  showQuestionScreen() {
    this.animationManager.fadeOut(this.baseUI.startScreen);
    this.animationManager.fadeOut(this.baseUI.resultScreen);
    this.animationManager.fadeIn(this.baseUI.questionScreen);

    // Hide explanation when showing a new question
    this.questionManager.hideExplanation();

    // Reset pause button if exists
    if (this.baseUI.pauseButton) {
      this.baseUI.pauseButton.dataset.state = 'running';
      this.baseUI.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
      this.baseUI.pauseButton.setAttribute('aria-label', 'Pause quiz');
    }

    // Ensure focus is set to the question for screen readers
    setTimeout(() => {
      this.baseUI.questionText.focus();
      this.baseUI.questionText.setAttribute('tabindex', '-1');
    }, 100);
  }

  // Update the showResultScreen method to ensure the title is added

  showResultScreen() {
    if (!this.baseUI.resultScreen) {
      console.error('Result screen element not found');
      return;
    }

    // Hide other screens
    this.animationManager.fadeOut(this.baseUI.startScreen);
    this.animationManager.fadeOut(this.baseUI.questionScreen);

    // Add the Quiz Completed! title
    this.resultManager.addQuizCompletedTitle();

    // Show result screen with fade effect
    this.animationManager.fadeIn(this.baseUI.resultScreen);

    // Ensure critical elements exist before animating
    if (this.baseUI.scorePercent && this.baseUI.scoreText) {
      // Animate score counter
      this.resultManager.animateScoreCounter();
    } else {
      console.error('Score elements not found');
    }

    // Ensure focus is set for accessibility
    setTimeout(() => {
      if (this.baseUI.scoreText) {
        this.baseUI.scoreText.focus();
        this.baseUI.scoreText.setAttribute('tabindex', '-1');
      }
    }, 100);
  }

  // Button binding methods
  bindStartButton(callback) {
    if (this.baseUI.startButton) {
      this.baseUI.startButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animationManager.animateButton(this.baseUI.startButton);
        callback();
      });
    }
  }

  bindRestartButton(callback) {
    if (this.baseUI.restartButton) {
      this.baseUI.restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animationManager.animateButton(this.baseUI.restartButton);
        callback();
      });
    }
  }

  bindChangeTopic(callback) {
    if (this.baseUI.changeTopicButton) {
      this.baseUI.changeTopicButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animationManager.animateButton(this.baseUI.changeTopicButton);
        callback();
      });
    }
  }

  bindShareButton(callback) {
    if (this.baseUI.shareButton) {
      this.baseUI.shareButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animationManager.animateButton(this.baseUI.shareButton);

        // Check if Web Share API is supported
        if (navigator.share) {
          callback({ native: true });
        } else {
          callback({ native: false });
        }
      });
    }
  }

  bindPauseButton(pauseCallback, resumeCallback) {
    if (this.baseUI.pauseButton) {
      // Initialize the state if not already set
      if (!this.baseUI.pauseButton.dataset.state) {
        this.baseUI.pauseButton.dataset.state = 'running';
      }

      this.baseUI.pauseButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animationManager.animateButton(this.baseUI.pauseButton);

        if (this.baseUI.pauseButton.dataset.state === 'running') {
          // Switch to paused state
          this.baseUI.pauseButton.dataset.state = 'paused';
          this.baseUI.pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
          this.baseUI.pauseButton.setAttribute('aria-label', 'Resume quiz');
          pauseCallback(); // Call the pause callback
        } else {
          // Switch to running state
          this.baseUI.pauseButton.dataset.state = 'running';
          this.baseUI.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
          this.baseUI.pauseButton.setAttribute('aria-label', 'Pause quiz');
          resumeCallback(); // Call the resume callback
        }
      });
    }
  }

  // Find the updatePauseButton method and replace it with this:

  updatePauseButton(isPaused) {
    if (!this.baseUI.pauseButton) return;

    // Update button state
    this.baseUI.pauseButton.dataset.state = isPaused ? 'paused' : 'running';

    // Update button text and icon
    this.baseUI.pauseButton.innerHTML = isPaused
      ? '<i class="fas fa-play"></i> Resume'
      : '<i class="fas fa-pause"></i> Pause';

    // Update accessibility label
    this.baseUI.pauseButton.setAttribute('aria-label', isPaused ? 'Resume quiz' : 'Pause quiz');

    // Apply appropriate styling
    if (isPaused) {
      this.baseUI.pauseButton.classList.add('bg-green-600', 'text-white');
      this.baseUI.pauseButton.classList.remove('bg-white', 'border-gray-300');
    } else {
      this.baseUI.pauseButton.classList.remove('bg-green-600', 'text-white');
      this.baseUI.pauseButton.classList.add('bg-white', 'border-gray-300');
    }

    // Visual indication that quiz is paused
    if (this.baseUI.questionScreen) {
      if (isPaused) {
        this.baseUI.questionScreen.classList.add('quiz-paused');
      } else {
        this.baseUI.questionScreen.classList.remove('quiz-paused');
      }
    }

    // Announce for screen readers
    this.baseUI.announceForScreenReader(isPaused ? 'Quiz paused' : 'Quiz resumed');
  }

  showLoadingState(isLoading) {
    if (!this.baseUI.startButton) return;

    if (isLoading) {
      this.baseUI.startButton.disabled = true;
      this.baseUI.startButton.innerHTML = `
        <span class="inline-block animate-pulse">Loading...</span>
        <div class="loading-spinner"></div>
      `;
      this.baseUI.startButton.setAttribute('aria-busy', 'true');
    } else {
      this.baseUI.startButton.disabled = false;
      this.baseUI.startButton.innerHTML = 'Start Quiz';
      this.baseUI.startButton.removeAttribute('aria-busy');
    }
  }

  showToast(message, type, duration) {
    return this.notificationManager.showToast(message, type, duration);
  }

  shareResults(score, total, topic) {
    this.shareManager.shareResults(score, total, topic);
  }

  showResumePrompt(onYes, onNo) {
    if (!this.baseUI.resumeDialog) return;

    // Add fade-in effect
    this.baseUI.resumeDialog.classList.add('fade-in');
    this.baseUI.resumeDialog.classList.remove('hidden');

    setTimeout(() => {
      this.baseUI.resumeDialog.classList.remove('fade-in');
    }, 300);

    const yesButton = document.getElementById('resume-yes');
    const noButton = document.getElementById('resume-no');

    if (!yesButton || !noButton) return;

    // Store reference to 'this' for use in functions
    const self = this;

    // Use function expressions with variable declarations
    let handleYes;
    let handleNo;
    let handleKeydown;

    // Define the cleanup function first since it doesn't depend on other functions
    const cleanupEventListeners = () => {
      yesButton.removeEventListener('click', handleYes);
      noButton.removeEventListener('click', handleNo);
      document.removeEventListener('keydown', handleKeydown);
    };

    // Now define the handlers
    handleYes = () => {
      self.dismissResumeDialog();
      cleanupEventListeners();
      onYes();
    };

    handleNo = () => {
      self.dismissResumeDialog();
      cleanupEventListeners();
      onNo();
    };

    handleKeydown = (e) => {
      if (e.key === 'Escape') {
        handleNo();
      } else if (e.key === 'Enter') {
        handleYes();
      }
    };

    // Add event listeners after all functions are defined
    yesButton.addEventListener('click', handleYes);
    noButton.addEventListener('click', handleNo);
    document.addEventListener('keydown', handleKeydown);

    // Focus yes button for accessibility
    setTimeout(() => {
      yesButton.focus();
    }, 100);
  }

  dismissResumeDialog() {
    if (!this.baseUI.resumeDialog) return;

    this.baseUI.resumeDialog.classList.add('fade-out');

    setTimeout(() => {
      this.baseUI.resumeDialog.classList.add('hidden');
      this.baseUI.resumeDialog.classList.remove('fade-out');
    }, 300);
  }

  // Delegate methods for question management
  setQuestionText(text) {
    this.questionManager.setQuestionText(text);
  }

  renderOptions(options, onSelect) {
    this.questionManager.renderOptions(options, onSelect);
  }

  showAnswerFeedback(selectedIndex, correctIndex) {
    this.questionManager.showAnswerFeedback(selectedIndex, correctIndex);
  }

  showExplanation(explanation) {
    this.questionManager.showExplanation(explanation);
  }

  hideExplanation() {
    this.questionManager.hideExplanation();
  }

  updateProgress(current, total, percentage) {
    this.questionManager.updateProgress(current, total, percentage);
  }

  updateTimer(seconds) {
    this.questionManager.updateTimer(seconds, this.accessibilityManager);
  }

  // Delegate methods for result management
  updateScore(score, total, percentage) {
    this.resultManager.updateScore(score, total, percentage);
  }

  showPerformanceAnalysis(analysis) {
    this.resultManager.showPerformanceAnalysis(analysis);
  }

  showQuestionReview(questions, userAnswers) {
    this.resultManager.showQuestionReview(questions, userAnswers);
  }

  showTimeWarning(secondsLeft) {
    this.questionManager.showTimeWarning(secondsLeft);
  }

  showError(message) {
    // Use the toast system for errors with a longer duration
    this.notificationManager.showToast(message, 'error', 5000);
  }

  updateQuizTypeSelection(quizType) {
    try {
      // Find any elements that represent quiz type selection
      const quizTypeSelectors = document.querySelectorAll('[data-quiz-type]');

      if (quizTypeSelectors.length > 0) {
        // Remove active class from all
        quizTypeSelectors.forEach((el) => {
          el.classList.remove('active', 'selected');
        });

        // Add active class to the selected one
        const selectedElement = document.querySelector(`[data-quiz-type="${quizType}"]`);
        if (selectedElement) {
          selectedElement.classList.add('active', 'selected');
        }
      }

      // Update any quiz type text displays
      const quizTypeDisplays = document.querySelectorAll('.quiz-type-display');
      quizTypeDisplays.forEach((el) => {
        el.textContent = this.formatQuizType(quizType);
      });
    } catch (error) {
      console.warn('Failed to update quiz type selection in UI:', error);
    }
  }

  updateDifficultySelection(difficulty) {
    try {
      // Find any elements that represent difficulty selection
      const difficultySelectors = document.querySelectorAll('[data-difficulty]');

      if (difficultySelectors.length > 0) {
        // Remove active class from all
        difficultySelectors.forEach((el) => {
          el.classList.remove('active', 'selected');
        });

        // Add active class to the selected one
        const selectedElement = document.querySelector(`[data-difficulty="${difficulty}"]`);
        if (selectedElement) {
          selectedElement.classList.add('active', 'selected');
        }
      }

      // Update any difficulty text displays
      const difficultyDisplays = document.querySelectorAll('.difficulty-display');
      difficultyDisplays.forEach((el) => {
        el.textContent = this.formatDifficulty(difficulty);
      });
    } catch (error) {
      console.warn('Failed to update difficulty selection in UI:', error);
    }
  }

  formatQuizType(quizType) {
    const typeNames = {
      js: 'JavaScript',
      ts: 'TypeScript',
      react: 'React',
      node: 'Node.js',
      html: 'HTML',
      css: 'CSS',
    };

    return typeNames[quizType] || quizType;
  }

  formatDifficulty(difficulty) {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }
}
