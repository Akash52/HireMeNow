export class QuizState {
  constructor(quizManager) {
    this.quizManager = quizManager;
  }

  saveState() {
    try {
      const { quizManager } = this;

      if (!quizManager || !quizManager.shuffledQuestions) {
        return false;
      }

      const state = {
        currentQuestion: quizManager.currentQuestion,
        score: quizManager.score,
        userAnswers: quizManager.userAnswers,
        shuffledQuestions: quizManager.shuffledQuestions,
        quizType: quizManager.quizType,
        difficulty: quizManager.difficulty,
        isPaused: quizManager.isPaused,
        hasShownResults: quizManager.hasShownResults,
        timeRemaining: quizManager.timerManager ? quizManager.timerManager.timeRemaining : 0,
        timestamp: Date.now(),
      };

      localStorage.setItem('quizState', JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Error saving quiz state:', error);
      return false;
    }
  }

  loadSavedState(state) {
    try {
      const { quizManager } = this;

      // Validate the state
      if (
        !state ||
        !state.shuffledQuestions ||
        !Array.isArray(state.shuffledQuestions) ||
        state.shuffledQuestions.length === 0
      ) {
        throw new Error('Invalid quiz state');
      }

      // Check if state is too old (more than 24 hours)
      const stateAge = Date.now() - (state.timestamp || 0);
      if (stateAge > 86400000) {
        // 24 hours in milliseconds
        throw new Error('Saved state is too old');
      }

      quizManager.currentQuestion = state.currentQuestion >= 0 ? state.currentQuestion : 0;
      quizManager.score = state.score >= 0 ? state.score : 0;
      quizManager.userAnswers = Array.isArray(state.userAnswers) ? state.userAnswers : [];
      quizManager.shuffledQuestions = state.shuffledQuestions;
      quizManager.quizType = state.quizType || quizManager.quizType;
      quizManager.difficulty = state.difficulty || 'easy';

      if (quizManager.timerManager) {
        quizManager.timerManager.timeRemaining =
          state.timeRemaining > 0 ? state.timeRemaining : quizManager.timePerQuestion;
      } else {
        quizManager.timeRemaining =
          state.timeRemaining > 0 ? state.timeRemaining : quizManager.timePerQuestion;
      }

      quizManager.isPaused = Boolean(state.isPaused);
      quizManager.hasShownResults = Boolean(state.hasShownResults);

      // Ensure we don't exceed question bounds
      if (quizManager.currentQuestion >= quizManager.shuffledQuestions.length) {
        quizManager.currentQuestion = quizManager.shuffledQuestions.length - 1;
      }

      quizManager.uiManager.showQuestionScreen();
      quizManager.loadQuestion();

      // Only start timer if not paused
      if (!quizManager.isPaused) {
        if (quizManager.startTimer) {
          quizManager.startTimer();
        } else if (quizManager.timerManager && quizManager.timerManager.startTimer) {
          quizManager.timerManager.startTimer();
        }
      } else {
        quizManager.uiManager.updatePauseButton(true);
      }

      return true;
    } catch (error) {
      console.warn('Could not restore quiz state:', error);
      return false;
    }
  }

  checkStateIntegrity() {
    try {
      const savedState = localStorage.getItem('quizState');
      if (!savedState) return false;

      const parsedState = JSON.parse(savedState);

      // Simple validation check
      const isValid =
        parsedState &&
        Array.isArray(parsedState.shuffledQuestions) &&
        parsedState.shuffledQuestions.length > 0 &&
        typeof parsedState.currentQuestion === 'number';

      if (!isValid) {
        localStorage.removeItem('quizState');
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Corrupted quiz state detected:', error);
      localStorage.removeItem('quizState');
      return false;
    }
  }
}
