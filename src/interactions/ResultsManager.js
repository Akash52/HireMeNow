export class ResultsManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  saveQuizResults(quizType, difficulty, score, questions, userAnswers) {
    try {
      // Get existing results history
      const savedResults = localStorage.getItem('quizResults');
      const resultsHistory = savedResults ? JSON.parse(savedResults) : [];

      // Add current result
      resultsHistory.push({
        date: new Date().toISOString(),
        quizType,
        difficulty,
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        timeSpent: userAnswers.reduce((total, answer) => total + answer.timeSpent, 0),
      });

      // Limit to last 20 results to avoid storage issues
      if (resultsHistory.length > 20) {
        resultsHistory.shift();
      }

      localStorage.setItem('quizResults', JSON.stringify(resultsHistory));
    } catch (error) {
      console.error('Failed to save quiz results:', error);
    }
  }

  shareResults(score, questions, hasShownResults, quizType, difficulty, analyticsManager) {
    if (!hasShownResults || questions.length === 0) {
      this.uiManager.showToast('Complete the quiz first to share results', 'warning');
      return;
    }

    const percentage = Math.round((score / questions.length) * 100);
    const shareText = `I scored ${score}/${questions.length} (${percentage}%) on the HireMeNow ${quizType.toUpperCase()} ${difficulty} Quiz!`;

    if (analyticsManager) {
      analyticsManager.trackEvent('share_results', {
        score,
        percentage,
        quizType,
        difficulty,
      });
    }

    try {
      if (navigator.share) {
        navigator
          .share({
            title: 'My HireMeNow Quiz Results',
            text: shareText,
            url: window.location.href,
          })
          .catch((err) => {
            console.warn('Share failed:', err);
            this.fallbackShare(shareText);
          });
      } else {
        this.fallbackShare(shareText);
      }
    } catch (error) {
      console.error('Error sharing results:', error);
      this.fallbackShare(shareText);
    }
  }

  fallbackShare(shareText) {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        this.uiManager.showToast('Results copied to clipboard!', 'success');
      })
      .catch((err) => {
        console.error('Clipboard write failed:', err);
        this.uiManager.showToast('Could not copy results', 'error');
      });
  }
}
