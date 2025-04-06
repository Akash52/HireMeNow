/**
 * Share Manager handles sharing quiz results
 */
export class ShareManager {
  constructor(notificationManager) {
    this.notificationManager = notificationManager;
  }

  shareResults(score, total, topic) {
    const percentage = Math.round((score / total) * 100);
    const text = `I scored ${score}/${total} (${percentage}%) on the ${topic} quiz!`;
    const url = window.location.href;

    // Check if Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          title: 'My Quiz Results',
          text,
          url,
        })
        .then(() => this.notificationManager.showToast('Shared successfully!', 'success'))
        .catch((err) => {
          console.error('Share error:', err);
          this.notificationManager.showToast('Could not share results', 'error');
        });
    } else {
      // Fallback to clipboard
      const fullText = `${text}\nTry it yourself: ${url}`;

      navigator.clipboard
        .writeText(fullText)
        .then(() => this.notificationManager.showToast('Results copied to clipboard!', 'success'))
        .catch(() => this.notificationManager.showToast('Could not copy to clipboard', 'error'));
    }
  }
}
