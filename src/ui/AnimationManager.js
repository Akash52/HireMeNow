/**
 * Animation Manager handles all UI animations and transitions
 */
export class AnimationManager {
  fadeIn(element) {
    if (!element) return;

    element.classList.add('fade-in');
    element.classList.remove('hidden');

    setTimeout(() => {
      element.classList.remove('fade-in');
    }, 500);
  }

  fadeOut(element) {
    if (!element) return;
    if (element.classList.contains('hidden')) return;

    element.classList.add('fade-out');

    setTimeout(() => {
      element.classList.add('hidden');
      element.classList.remove('fade-out');
    }, 500);
  }

  animateButton(button) {
    if (!button) return;

    button.classList.add('btn-pulse');
    setTimeout(() => {
      button.classList.remove('btn-pulse');
    }, 300);
  }

  animateProgressBar(progressBar, fromPercent, toPercent) {
    if (!progressBar) return;

    const duration = 500; // ms
    const start = performance.now();

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = fromPercent + (toPercent - fromPercent) * progress;
      progressBar.style.width = `${currentPercent}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  animateScoreCounter(scorePercent, scoreText, finalScore, totalQuestions, scorePercentage) {
    if (!scorePercent || !scoreText) return;

    const duration = 2000; // ms
    const start = performance.now();
    let currentScore = 0;
    let currentPercentage = 0;

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - (1 - progress) ** 4;

      currentScore = Math.round(finalScore * easeOutQuart);
      currentPercentage = Math.round(scorePercentage * easeOutQuart);

      scorePercent.textContent = `${currentPercentage}%`;
      scoreText.textContent = `You scored ${currentScore} out of ${totalQuestions}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  showConfetti() {
    // Create confetti container if it doesn't exist
    let confettiContainer = document.getElementById('confetti-container');

    if (!confettiContainer) {
      confettiContainer = document.createElement('div');
      confettiContainer.id = 'confetti-container';
      document.body.appendChild(confettiContainer);
    }

    // Create confetti pieces
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4CAF50',
    ];
    const confettiCount = 150;

    confettiContainer.innerHTML = '';

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;

      confettiContainer.appendChild(confetti);
    }

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
}
