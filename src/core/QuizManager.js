import { QuizState } from './QuizState.js';
import { QuizValidator } from '../utils/QuizValidator.js';
import { QuestionShuffler } from '../utils/QuestionShuffler.js';
import { PerformanceAnalyzer } from '../analytics/PerformanceAnalyzer.js';
import { TimerManager } from '../interactions/TimerManager.js';
import { ResultsManager } from '../interactions/ResultsManager.js';

export class QuizManager {
  constructor(questions, uiManager, quizType = 'js', difficulty = 'easy') {
    const validator = new QuizValidator();

    // Validate inputs
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Quiz requires a non-empty array of questions');
    }
    if (!uiManager) {
      throw new Error('UI Manager is required');
    }

    this.questions = validator.validateQuestions(questions);
    this.uiManager = uiManager;
    this.quizType = quizType;
    this.difficulty = validator.validateDifficulty(difficulty);
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isPaused = false;
    this.isTransitioning = false; // Prevent multiple clicks during transitions
    this.hasShownResults = false;
    this.shuffledQuestions = [...this.questions]; // Will be shuffled on start

    // Initialize components
    this.quizState = new QuizState(this);
    this.questionShuffler = new QuestionShuffler();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    this.resultsManager = new ResultsManager(this.uiManager);
    this.timePerQuestion = this.getTimePerDifficulty(this.difficulty);
    this.timerManager = new TimerManager(this.timePerQuestion, uiManager, {
      onTimeUp: () => this.handleTimeUp(),
      onPause: () => {
        this.isPaused = true;
      },
      onResume: () => {
        this.isPaused = false;
      },
      updateState: () => this.quizState.saveState(),
    });
  }

  handleTimeUp() {
    // Only auto-submit if not paused
    if (!this.isPaused) {
      this.handleAnswer(-1); // -1 indicates no answer selected
    }
  }

  getTimePerDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 30; // 30 seconds for easy questions
      case 'medium':
        return 45; // 45 seconds for medium questions
      case 'hard':
        return 60; // 60 seconds for hard questions
      default:
        return 30;
    }
  }

  startQuiz() {
    try {
      this.shuffleQuestions();
      this.uiManager.showQuestionScreen();
      this.loadQuestion();
      this.timerManager.startTimer();
      this.hasShownResults = false;
      this.quizState.saveState();

      // Update URL to include quiz state
      if (window.appRouter) {
        window.appRouter.navigate('quiz', {
          type: this.quizType,
          difficulty: this.difficulty,
          state: 'active'
        });
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      this.uiManager.showError('Could not start quiz. Please try again.');
    }
  }

  restartQuiz() {
    this.timerManager.stopTimer();
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isPaused = false;
    this.isTransitioning = false;
    this.hasShownResults = false;
    this.startQuiz();
  }

  shuffleQuestions() {
    const { shuffled, limit } = this.questionShuffler.shuffle(this.questions, this.difficulty);
    this.shuffledQuestions = shuffled.slice(0, limit);
  }

  loadQuestion() {
    if (this.currentQuestion >= this.shuffledQuestions.length) {
      this.showResults();
      return;
    }

    const question = this.shuffledQuestions[this.currentQuestion];
    if (!question) {
      console.error('Question not found at index:', this.currentQuestion);
      this.showResults();
      return;
    }

    const totalQuestions = this.shuffledQuestions.length;
    const progress = (this.currentQuestion / totalQuestions) * 100;

    this.uiManager.updateProgress(this.currentQuestion + 1, totalQuestions, progress);
    this.uiManager.setQuestionText(question.question);
    this.uiManager.renderOptions(question.options, (selectedIndex) =>
      this.handleAnswer(selectedIndex)
    );

    // This will reset the timer and also reset pause state
    this.timerManager.resetTimer();
    this.isPaused = false;
    this.quizState.saveState();
  }

  // Add this method to the QuizManager class

  loadSavedState(state) {
    try {
      // Validate the state
      if (
        !state ||
        !state.shuffledQuestions ||
        !Array.isArray(state.shuffledQuestions) ||
        state.shuffledQuestions.length === 0
      ) {
        console.error('Invalid quiz state structure', state);
        return false;
      }

      // Restore quiz state
      this.shuffledQuestions = state.shuffledQuestions;
      this.currentQuestion = state.currentQuestion >= 0 ? state.currentQuestion : 0;
      this.score = state.score >= 0 ? state.score : 0;
      this.userAnswers = Array.isArray(state.userAnswers) ? state.userAnswers : [];
      this.quizType = state.quizType || this.quizType;
      this.difficulty = state.difficulty || 'easy';
      this.isPaused = Boolean(state.isPaused);
      this.hasShownResults = Boolean(state.hasShownResults);

      // Safety check to prevent out of bounds
      if (this.currentQuestion >= this.shuffledQuestions.length) {
        this.currentQuestion = Math.max(0, this.shuffledQuestions.length - 1);
      }

      // Restore UI state
      this.uiManager.showQuestionScreen();
      this.loadQuestion();

      // Handle timer state
      if (state.timeRemaining > 0) {
        this.timerManager.timeRemaining = state.timeRemaining;
      }

      // Start or pause timer based on state
      if (this.isPaused) {
        this.timerManager.pauseTimer();
      } else {
        this.timerManager.startTimer();
      }

      console.log('Quiz state loaded successfully', {
        currentQuestion: this.currentQuestion,
        totalQuestions: this.shuffledQuestions.length,
        score: this.score,
      });

      return true;
    } catch (error) {
      console.error('Error loading saved state:', error);
      return false;
    }
  }

  // Find the handleAnswer method and update it:

  handleAnswer(selectedIndex) {
    // Prevent multiple submissions
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Stop the timer immediately
    this.timerManager.stopTimer();

    const question = this.shuffledQuestions[this.currentQuestion];
    if (!question) {
      console.error('Question not found during answer handling');
      this.isTransitioning = false;
      this.moveToNextQuestion();
      return;
    }

    const correct = selectedIndex === question.correctAnswer;

    // Calculate actual time spent on this question
    const timeSpent = Math.max(1, this.timePerQuestion - this.timerManager.timeRemaining);

    // Store user's answer for review later
    this.userAnswers.push({
      questionId: question.id || `q-${this.currentQuestion}`,
      questionIndex: this.currentQuestion,
      userAnswer: selectedIndex,
      correctAnswer: question.correctAnswer,
      isCorrect: correct,
      timeSpent,
      category: question.category || 'general',
      timestamp: new Date().toISOString(),
    });

    this.uiManager.showAnswerFeedback(selectedIndex, question.correctAnswer);

    if (question.explanation) {
      this.uiManager.showExplanation(question.explanation);
    }

    if (correct) {
      this.score++;
    }

    this.quizState.saveState();

    // Set a timer to move to the next question
    setTimeout(() => {
      this.isTransitioning = false;
      this.moveToNextQuestion();
    }, 2000);
  }

  moveToNextQuestion() {
    this.currentQuestion++;

    if (this.currentQuestion < this.shuffledQuestions.length) {
      this.loadQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    if (this.hasShownResults) return;
    this.hasShownResults = true;

    this.timerManager.stopTimer();
    this.uiManager.showResultScreen();

    const totalQuestions = this.shuffledQuestions.length;
    if (totalQuestions === 0) {
      this.uiManager.showError('No questions were available for this quiz.');
      return;
    }

    const percentage = Math.round((this.score / totalQuestions) * 100);
    this.uiManager.updateScore(this.score, totalQuestions, percentage);

    // Generate detailed performance analysis
    const analysis = this.performanceAnalyzer.generateAnalysis(
      this.shuffledQuestions,
      this.userAnswers,
      this.quizType,
      this.difficulty
    );

    this.uiManager.showPerformanceAnalysis(analysis);

    // Generate review of questions
    this.uiManager.showQuestionReview(this.shuffledQuestions, this.userAnswers);

    // Save final results to local storage for historical tracking
    this.resultsManager.saveQuizResults(
      this.quizType,
      this.difficulty,
      this.score,
      this.shuffledQuestions,
      this.userAnswers
    );

    // Clear saved in-progress state as quiz is complete
    localStorage.removeItem('quizState');
  }

  shareResults(analyticsManager) {
    // Update the shareResults method to include proper URL for sharing
    if (window.appRouter) {
      const shareUrl = new URL(window.location.href);
      const params = new URLSearchParams(shareUrl.search);
      
      params.set('route', 'quiz');
      params.set('type', this.quizType);
      params.set('difficulty', this.difficulty);
      
      shareUrl.search = params.toString();
      
      // Pass the shareable URL to the resultsManager
      this.resultsManager.setShareableUrl(shareUrl.toString());
    }
    
    this.resultsManager.shareResults(
      this.score,
      this.shuffledQuestions,
      this.hasShownResults,
      this.quizType,
      this.difficulty,
      analyticsManager
    );
  }

  togglePause() {
    if (this.isTransitioning) return;

    if (this.timerManager.isPaused) {
      this.timerManager.resumeTimer();
    } else {
      this.timerManager.pauseTimer();
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      if (this.isPaused || this.isTransitioning || this.hasShownResults) return;

      // Number keys 1-4 select options
      if (event.key >= '1' && event.key <= '4') {
        const optionIndex = parseInt(event.key) - 1;
        const question = this.shuffledQuestions[this.currentQuestion];
        if (question && optionIndex >= 0 && optionIndex < question.options.length) {
          this.handleAnswer(optionIndex);
        }
      }

      // Space bar to pause/resume
      if (event.code === 'Space' && !event.target.matches('button, input, textarea')) {
        event.preventDefault();
        this.togglePause();
      }
    });
  }

  // Make sure we have a stopTimer method if it's not already defined
  stopTimer() {
    if (this.timerManager) {
      this.timerManager.stopTimer();
    }
  }
}
