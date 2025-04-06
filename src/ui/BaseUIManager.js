/**
 * Base UI Manager class that handles core UI functionality
 */
export class BaseUIManager {
  constructor() {
    // Initialize DOM elements
    this.initializeElements();

    // Track UI states
    this.isExplanationShown = false;
    this.animationInProgress = false;
    this.currentExplanation = null;
  }

  initializeElements() {
    // Main containers
    this.startScreen =
      document.getElementById('start-screen') || this.createFallbackElement('div', 'start-screen');
    this.questionScreen =
      document.getElementById('question-screen') ||
      this.createFallbackElement('div', 'question-screen');
    this.resultScreen =
      document.getElementById('result-screen') ||
      this.createFallbackElement('div', 'result-screen');
    this.quizContainer =
      document.getElementById('quiz-container') ||
      this.createFallbackElement('div', 'quiz-container');

    // Question screen elements
    this.questionNumber =
      document.getElementById('question-number') ||
      this.createFallbackElement('div', 'question-number');
    this.progressPercent =
      document.getElementById('progress-percent') ||
      this.createFallbackElement('div', 'progress-percent');
    this.progressBar =
      document.getElementById('progress-bar') || this.createFallbackElement('div', 'progress-bar');
    this.questionText =
      document.getElementById('question-text') ||
      this.createFallbackElement('div', 'question-text');
    this.optionsContainer =
      document.getElementById('options-container') ||
      this.createFallbackElement('div', 'options-container');
    this.explanationContainer =
      document.getElementById('explanation-container') ||
      this.createFallbackElement('div', 'explanation-container');
    this.explanationText =
      document.getElementById('explanation-text') ||
      this.createFallbackElement('div', 'explanation-text');
    this.timerDisplay =
      document.getElementById('timer-display') ||
      this.createFallbackElement('div', 'timer-display');

    // Result screen elements
    this.scorePercent =
      document.getElementById('score-percent') ||
      this.createFallbackElement('div', 'score-percent');
    this.scoreText =
      document.getElementById('score-text') || this.createFallbackElement('div', 'score-text');
    this.feedbackMessage =
      document.getElementById('feedback-message') ||
      this.createFallbackElement('div', 'feedback-message');
    this.analysisContent =
      document.getElementById('analysis-content') ||
      this.createFallbackElement('div', 'analysis-content');
    this.reviewQuestions =
      document.getElementById('review-questions') ||
      this.createFallbackElement('div', 'review-questions');

    // Buttons
    this.startButton =
      document.getElementById('start-button') ||
      this.createFallbackElement('button', 'start-button');
    this.restartButton =
      document.getElementById('restart-button') ||
      this.createFallbackElement('button', 'restart-button');
    this.changeTopicButton =
      document.getElementById('change-topic-button') ||
      this.createFallbackElement('button', 'change-topic-button');
    this.shareButton =
      document.getElementById('share-button') ||
      this.createFallbackElement('button', 'share-button');
    this.pauseButton =
      document.getElementById('pause-button') ||
      this.createFallbackElement('button', 'pause-button');
    this.exportPdfButton =
      document.getElementById('export-pdf-button') ||
      this.createFallbackElement('button', 'export-pdf-button');

    // Toast container
    this.toastContainer =
      document.getElementById('toast-container') ||
      this.createFallbackElement('div', 'toast-container');

    // Resume dialog
    this.resumeDialog =
      document.getElementById('resume-dialog') ||
      this.createFallbackElement('div', 'resume-dialog');
  }

  createFallbackElement(type, id) {
    const element = document.createElement(type);
    element.id = id;
    document.body.appendChild(element);
    console.warn(`Element with id '${id}' not found, created fallback element`);
    return element;
  }

  stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  announceForScreenReader(message) {
    // Create or get the live region for screen reader announcements
    let ariaLive = document.getElementById('aria-live-announcer');

    if (!ariaLive) {
      ariaLive = document.createElement('div');
      ariaLive.id = 'aria-live-announcer';
      ariaLive.className = 'sr-only';
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.setAttribute('aria-atomic', 'true');
      document.body.appendChild(ariaLive);
    }

    // Update the content to trigger screen reader announcement
    ariaLive.textContent = message;
  }
}
