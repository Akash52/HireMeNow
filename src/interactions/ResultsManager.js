export class ResultsManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.shareableUrl = window.location.href;
  }

  setShareableUrl(url) {
    this.shareableUrl = url;
    return this;
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

    // Use the properly formatted URL for sharing
    if (navigator.share) {
      navigator.share({
        title: `My ${quizType.toUpperCase()} Quiz Results - ${score}%`,
        text: `I scored ${score}% on the ${quizType.toUpperCase()} ${difficulty} quiz! Can you beat my score?`,
        url: this.shareableUrl
      })
        .then(() => {
          analyticsManager.trackEvent('share_results_success', { method: 'web_share_api' });
        })
        .catch((error) => {
          analyticsManager.trackEvent('share_results_error', { method: 'web_share_api', error: error.message });
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      try {
        navigator.clipboard.writeText(
          `I scored ${score}% on the ${quizType.toUpperCase()} ${difficulty} quiz! Can you beat my score? ${this.shareableUrl}`
        );
        this.uiManager.showToast('Results copied to clipboard!', 'success');
        analyticsManager.trackEvent('share_results_success', { method: 'clipboard' });
      } catch (error) {
        this.uiManager.showToast('Failed to copy results.', 'error');
        analyticsManager.trackEvent('share_results_error', { method: 'clipboard', error: error.message });
      }
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
