/**
 * Result Manager handles the results screen functionality
 */
export class ResultManager {
  constructor(baseUIManager, animationManager) {
    this.baseUI = baseUIManager;
    this.animationManager = animationManager;
    this.finalScore = 0;
    this.totalQuestions = 0;
    this.scorePercentage = 0;
  }

  // Updated updateScore method

  updateScore(score, total, percentage) {
    console.log('Updating score:', score, total, percentage);

    if (!this.baseUI.scorePercent || !this.baseUI.scoreText || !this.baseUI.feedbackMessage) {
      console.error('Required score elements not found');
      return;
    }

    // Store the values for animation
    this.finalScore = score;
    this.totalQuestions = total;
    this.scorePercentage = percentage;

    // Set initial values for animation
    this.baseUI.scorePercent.textContent = '0%';

    // Set appropriate color based on score
    if (this.baseUI.scorePercent.classList) {
      // Remove any existing color classes
      this.baseUI.scorePercent.classList.remove(
        'text-green-600',
        'text-red-600',
        'text-yellow-500'
      );

      // Add appropriate color class
      if (percentage >= 70) {
        this.baseUI.scorePercent.classList.add('text-green-600');
      } else if (percentage >= 40) {
        this.baseUI.scorePercent.classList.add('text-yellow-500');
      } else {
        this.baseUI.scorePercent.classList.add('text-red-600');
      }
    }

    this.baseUI.scoreText.textContent = `You scored 0 out of ${total}`;

    // Feedback message with appropriate emoji
    let emoji = '';
    let feedbackText = '';

    if (percentage >= 90) {
      emoji = '🏆';
      feedbackText = "Outstanding! You're an expert!";
    } else if (percentage >= 80) {
      emoji = '🌟';
      feedbackText = "Excellent! You're well-prepared for your interview!";
    } else if (percentage >= 70) {
      emoji = '👍';
      feedbackText = "Great job! You're on the right track!";
    } else if (percentage >= 60) {
      emoji = '😊';
      feedbackText = "Good job! With a bit more study, you'll be fully prepared.";
    } else if (percentage >= 40) {
      emoji = '📚';
      feedbackText = 'Keep studying! Review the questions you missed.';
    } else {
      emoji = '💪';
      feedbackText = 'Keep practicing! Review the questions and try again.';
    }

    this.baseUI.feedbackMessage.innerHTML = `<span class="feedback-emoji">${emoji}</span> ${feedbackText}`;

    // Add confetti effect for good scores
    if (percentage >= 70) {
      setTimeout(() => {
        this.animationManager.showConfetti();
      }, 500);
    }

    // Ensure Quiz Completed title is present
    this.ensureQuizCompletedTitle();

    // Start score animation after a short delay
    setTimeout(() => {
      this.animateScoreCounter();
    }, 100);

    console.log('Score updated successfully');
  }

  // Make sure the animateScoreCounter method is properly implemented

  animateScoreCounter() {
    if (!this.baseUI.scorePercent || !this.baseUI.scoreText) {
      console.error('Cannot animate score: Elements not found');
      return;
    }

    const { animationInProgress } = this;

    if (animationInProgress) {
      console.warn('Score animation already in progress');
      return;
    }

    this.animationInProgress = true;
    console.log('Starting score animation');

    const duration = 2000; // ms
    const start = performance.now();
    let currentScore = 0;
    let currentPercentage = 0;

    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - (1 - progress) ** 4;

      currentScore = Math.round(this.finalScore * easeOutQuart);
      currentPercentage = Math.round(this.scorePercentage * easeOutQuart);

      this.baseUI.scorePercent.textContent = `${currentPercentage}%`;
      this.baseUI.scoreText.textContent = `You scored ${currentScore} out of ${this.totalQuestions}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animationInProgress = false;
        console.log('Score animation completed');
        // Announce final score for screen readers
        this.baseUI.announceForScreenReader(
          `Quiz completed! Your final score is ${this.finalScore} out of ${this.totalQuestions}, which is ${this.scorePercentage}%`
        );
      }
    };

    requestAnimationFrame(animate);
  }

  // Show performance analysis
  showPerformanceAnalysis(analysis) {
    if (!this.baseUI.analysisContent) {
      console.error('Analysis content element not found');
      return;
    }

    console.log('Analysis data received:', analysis);

    // Create a sanitized copy of the analysis with defaults
    const safeAnalysis = {
      averageTimePerQuestion: Math.round(analysis?.averageTimePerQuestion || 0),
      averageTimeCorrect: Math.round(analysis?.averageTimeCorrect || 0),
      averageTimeIncorrect: Math.round(analysis?.averageTimeIncorrect || 0),
      categoryPerformance: {},
      weakAreas: [],
    };

    // Safety check for weakAreas
    if (analysis && analysis.weakAreas && Array.isArray(analysis.weakAreas)) {
      safeAnalysis.weakAreas = analysis.weakAreas;
    }

    // Safety check for categoryPerformance
    if (
      analysis &&
      analysis.categoryPerformance &&
      typeof analysis.categoryPerformance === 'object'
    ) {
      safeAnalysis.categoryPerformance = analysis.categoryPerformance;
    }

    // Build HTML for the analysis sections
    let html = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 analysis-section fade-in">
      <div class="p-4 bg-white rounded shadow">
        <h4 class="font-bold text-indigo-900  mb-2">Time Statistics</h4>
        <div class="time-stats">
          <div class="stat-item flex justify-between py-1">
            <span class="stat-label">Average time per question:</span>
            <span class="stat-value font-medium">${safeAnalysis.averageTimePerQuestion}s</span>
          </div>
          <div class="stat-item flex justify-between py-1">
            <span class="stat-label">Average time for correct answers:</span>
            <span class="stat-value font-medium">${safeAnalysis.averageTimeCorrect}s</span>
          </div>
          <div class="stat-item flex justify-between py-1">
            <span class="stat-label">Average time for incorrect answers:</span>
            <span class="stat-value font-medium">${safeAnalysis.averageTimeIncorrect}s</span>
          </div>
        </div>
      </div>
      
      <div class="p-4 bg-white  rounded shadow">
        <h4 class="font-bold text-indigo-900  mb-2">Areas to Improve</h4>`;

    if (safeAnalysis.weakAreas.length === 0) {
      html += `<p class="text-green-600 font-medium">Great job! No specific weak areas identified.</p>`;
    } else {
      html += `
      <p class="text-gray-700  mb-2">Focus on these topics:</p>
      <ul class="list-disc pl-5 text-gray-700  weak-areas-list">
        ${safeAnalysis.weakAreas.map((area) => `<li>${area}</li>`).join('')}
      </ul>
    `;
    }

    html += `
      </div>
    </div>
  `;

    // Category Performance section
    html += `
    <div class="p-4 bg-white rounded shadow analysis-section fade-in" style="animation-delay: 0.2s">
      <h4 class="font-bold text-indigo-900  mb-3">Category Performance</h4>
      <div class="space-y-3 category-performance">
  `;

    // Add category performance bars
    const categories = Object.entries(safeAnalysis.categoryPerformance);

    if (categories.length === 0) {
      html += `<p class="text-gray-600">No category performance data available.</p>`;
    } else {
      categories.forEach(([category, stats]) => {
        // Default to 0 if stats are missing
        const correct = stats?.correct || 0;
        const total = stats?.total || 1; // Avoid division by zero
        const percentage = Math.round((correct / total) * 100);
        const colorClass = percentage >= 70 ? 'good' : percentage >= 40 ? 'average' : 'poor';

        html += `
        <div class="category-item">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-gray-700">${category}</span>
            <span class="text-gray-700">${correct}/${total} (${percentage}%)</span>
          </div>
          <div class="performance-bar">
            <div class="performance-bar-fill ${colorClass}" style="width: 0%"></div>
          </div>
        </div>
      `;
      });
    }

    html += `
      </div>
    </div>
  `;

    // Add the content to the DOM
    this.baseUI.analysisContent.innerHTML = html;
    console.log('Analysis HTML generated successfully');

    // Add CSS classes for performance bars
    this.ensurePerformanceBarStyles();

    // Animate performance bars after rendering
    setTimeout(() => {
      const bars = document.querySelectorAll('.performance-bar-fill');
      console.log(`Found ${bars.length} performance bars to animate`);

      categories.forEach(([category, stats], index) => {
        if (bars[index]) {
          const correct = stats?.correct || 0;
          const total = stats?.total || 1;
          const percentage = Math.round((correct / total) * 100);

          setTimeout(() => {
            bars[index].style.width = `${percentage}%`;
          }, index * 100);
        }
      });
    }, 500);
  }

  // Ensure performance bar styles are in the document
  ensurePerformanceBarStyles() {
    // Only add if they don't exist
    if (!document.getElementById('performance-bar-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'performance-bar-styles';
      styleEl.innerHTML = `
      .performance-bar {
        height: 8px;
        background-color: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }
      .performance-bar-fill {
        height: 100%;
        transition: width 0.8s ease-out;
      }
      .performance-bar-fill.good {
        background-color: #10b981;
      }
      .performance-bar-fill.average {
        background-color: #f59e0b;
      }
      .performance-bar-fill.poor {
        background-color: #ef4444;
      }
      .dark-theme .performance-bar {
        background-color: #F1F1F1;
      }
    `;
      document.head.appendChild(styleEl);
    }
  }

  // Ensure quiz completed title is present
  ensureQuizCompletedTitle() {
    const resultContent = document.getElementById('result-content');
    if (!resultContent) return;

    // Check if title already exists
    let titleElement = resultContent.querySelector('h2');

    if (!titleElement) {
      // Add the title element
      titleElement = document.createElement('h2');
      titleElement.className = 'text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-900';
      titleElement.textContent = 'Quiz Completed!';

      // Insert at the beginning
      resultContent.insertBefore(titleElement, resultContent.firstChild);
    }
  }

  // Add a helper method to ensure the Quiz Completed title is present
  addQuizCompletedTitle() {
    const resultContent = document.getElementById('result-content');
    if (!resultContent) return;

    // Check if the title already exists
    const existingTitle = resultContent.querySelector('h2');

    if (!existingTitle) {
      // Create and insert the title at the beginning
      const titleElement = document.createElement('h2');
      titleElement.className = 'text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-900';
      titleElement.textContent = 'Quiz Completed!';
      resultContent.insertBefore(titleElement, resultContent.firstChild);
    }
  }

  showQuestionReview(questions, userAnswers) {
    if (!this.baseUI.reviewQuestions) return;

    this.baseUI.reviewQuestions.innerHTML = '';

    userAnswers.forEach((answer, index) => {
      const question = questions[index];
      const { isCorrect } = answer;

      const reviewItem = document.createElement('div');
      reviewItem.className = `review-question ${isCorrect ? 'correct' : 'incorrect'} fade-in`;
      reviewItem.style.animationDelay = `${index * 100}ms`;

      // Clean option text for display (remove any numeric prefixes)
      const cleanUserAnswer =
        answer.userAnswer >= 0 ? this.cleanOptionText(question.options[answer.userAnswer]) : '';
      const cleanCorrectAnswer = this.cleanOptionText(question.options[question.correctAnswer]);

      reviewItem.innerHTML = `
        <div class="flex justify-between mb-2">
          <span class="font-medium question-text">${index + 1}. ${question.question}</span>
          <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium result-badge">
            ${isCorrect ? '<i class="fas fa-check-circle"></i> Correct' : '<i class="fas fa-times-circle"></i> Incorrect'}
          </span>
        </div>
        <div class="text-sm text-gray-700 mb-2 answer-details">
          <p class="user-answer">
            <strong>Your answer:</strong> 
            ${
              answer.userAnswer >= 0
                ? `<span class="${isCorrect ? 'text-green-600' : 'text-red-600'}">${cleanUserAnswer}</span>`
                : '<span class="text-orange-500"><i class="fas fa-clock"></i> Time expired</span>'
            }
          </p>
          <p class="correct-answer">
            <strong>Correct answer:</strong> 
            <span class="text-green-600">${cleanCorrectAnswer}</span>
          </p>
          <p class="time-spent">
            <strong><i class="fas fa-stopwatch"></i> Time spent:</strong> ${answer.timeSpent} seconds
          </p>
        </div>
        ${
          question.explanation
            ? `<div class="text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200 explanation-text">
            <div class="explanation-toggle" data-index="${index}">
              <i class="fas fa-lightbulb"></i> <strong>Show Explanation</strong>
            </div>
            <div class="explanation-content hidden" id="explanation-${index}">
              ${question.explanation}
            </div>
          </div>`
            : ''
        }
      `;

      this.baseUI.reviewQuestions.appendChild(reviewItem);

      // Remove fade-in class after animation completes
      setTimeout(
        () => {
          reviewItem.classList.remove('fade-in');
        },
        500 + index * 100
      );
    });

    // Add event listeners for explanation toggles
    const toggles = this.baseUI.reviewQuestions.querySelectorAll('.explanation-toggle');
    toggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const { index } = toggle.dataset;
        const content = document.getElementById(`explanation-${index}`);

        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          content.classList.add('fade-in');
          toggle.innerHTML = '<i class="fas fa-lightbulb"></i> <strong>Hide Explanation</strong>';

          setTimeout(() => {
            content.classList.remove('fade-in');
          }, 300);
        } else {
          content.classList.add('fade-out');

          setTimeout(() => {
            content.classList.add('hidden');
            content.classList.remove('fade-out');
            toggle.innerHTML = '<i class="fas fa-lightbulb"></i> <strong>Show Explanation</strong>';
          }, 300);
        }
      });
    });

    // Add filter controls for review questions
    this.addReviewFilters();
  }

  cleanOptionText(text) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/^\d+\.\s*/, '');
  }

  addReviewFilters() {
    // Create filter container if it doesn't exist
    let filterContainer = document.getElementById('review-filters');

    if (!filterContainer) {
      filterContainer = document.createElement('div');
      filterContainer.id = 'review-filters';
      filterContainer.className = 'review-filters mb-4 p-3 bg-gray-100 rounded';

      filterContainer.innerHTML = `
        <div class="text-sm font-medium mb-2">Filter questions:</div>
        <div class="flex flex-wrap gap-2">
          <button class="filter-btn active" data-filter="all">All Questions</button>
          <button class="filter-btn" data-filter="correct">Correct Only</button>
          <button class="filter-btn" data-filter="incorrect">Incorrect Only</button>
        </div>
      `;

      // Insert before review questions
      this.baseUI.reviewQuestions.parentNode.insertBefore(
        filterContainer,
        this.baseUI.reviewQuestions
      );

      // Add event listeners to filter buttons
      const filterButtons = filterContainer.querySelectorAll('.filter-btn');
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          // Update active state
          filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          // Apply filter
          const { filter } = btn.dataset;
          const questions = this.baseUI.reviewQuestions.querySelectorAll('.review-question');

          questions.forEach((q) => {
            if (filter === 'all') {
              q.classList.remove('hidden');
            } else if (filter === 'correct') {
              q.classList.toggle('hidden', !q.classList.contains('correct'));
            } else if (filter === 'incorrect') {
              q.classList.toggle('hidden', !q.classList.contains('incorrect'));
            }
          });

          // Announce for screen readers
          this.baseUI.announceForScreenReader(`Showing ${filter} questions`);
        });
      });
    }
  }
}
