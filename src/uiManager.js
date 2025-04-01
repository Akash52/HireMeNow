// export class UIManager {
//   constructor() {
//     // Main containers
//     this.startScreen = document.getElementById('start-screen');
//     this.questionScreen = document.getElementById('question-screen');
//     this.resultScreen = document.getElementById('result-screen');
//     this.quizContainer = document.getElementById('quiz-container');
    
//     // Question screen elements
//     this.questionNumber = document.getElementById('question-number');
//     this.progressPercent = document.getElementById('progress-percent');
//     this.progressBar = document.getElementById('progress-bar');
//     this.questionText = document.getElementById('question-text');
//     this.optionsContainer = document.getElementById('options-container');
//     this.explanationContainer = document.getElementById('explanation-container');
//     this.explanationText = document.getElementById('explanation-text');
//     this.timerDisplay = document.getElementById('timer-display');
    
//     // Result screen elements
//     this.scorePercent = document.getElementById('score-percent');
//     this.scoreText = document.getElementById('score-text');
//     this.feedbackMessage = document.getElementById('feedback-message');
//     this.analysisContent = document.getElementById('analysis-content');
//     this.reviewQuestions = document.getElementById('review-questions');
    
//     // Buttons
//     this.startButton = document.getElementById('start-button');
//     this.restartButton = document.getElementById('restart-button');
//     this.changeTopicButton = document.getElementById('change-topic-button');
//     this.shareButton = document.getElementById('share-button');
//     this.pauseButton = document.getElementById('pause-button');
    
//     // Toast container
//     this.toastContainer = document.getElementById('toast-container');
    
//     // Resume dialog
//     this.resumeDialog = document.getElementById('resume-dialog');
    
//     // Track if explanation is shown
//     this.isExplanationShown = false;
//   }
  
//   bindStartButton(callback) {
//     this.startButton.addEventListener('click', callback);
//   }
  
//   bindRestartButton(callback) {
//     this.restartButton.addEventListener('click', callback);
//   }
  
//   bindChangeTopic(callback) {
//     this.changeTopicButton.addEventListener('click', callback);
//   }
  
//   bindShareButton(callback) {
//     this.shareButton.addEventListener('click', callback);
//   }
  
//   bindPauseButton(pauseCallback, resumeCallback) {
//     if (this.pauseButton) {
//       this.pauseButton.addEventListener('click', () => {
//         if (this.pauseButton.dataset.state === 'running') {
//           this.pauseButton.dataset.state = 'paused';
//           this.pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
//           pauseCallback();
//         } else {
//           this.pauseButton.dataset.state = 'running';
//           this.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
//           resumeCallback();
//         }
//       });
//     }
//   }
  
//   showStartScreen() {
//     this.startScreen.classList.remove('hidden');
//     this.questionScreen.classList.add('hidden');
//     this.resultScreen.classList.add('hidden');
//   }
  
//   showQuestionScreen() {
//     this.startScreen.classList.add('hidden');
//     this.questionScreen.classList.remove('hidden');
//     this.resultScreen.classList.add('hidden');
    
//     // Hide explanation when showing a new question
//     this.hideExplanation();
    
//     // Reset pause button if exists
//     if (this.pauseButton) {
//       this.pauseButton.dataset.state = 'running';
//       this.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
//     }
//   }
  
//   showResultScreen() {
//     this.startScreen.classList.add('hidden');
//     this.questionScreen.classList.add('hidden');
//     this.resultScreen.classList.remove('hidden');
//   }
  
//   showLoadingState(isLoading) {
//     if (isLoading) {
//       this.startButton.disabled = true;
//       this.startButton.innerHTML = `
//         <span class="inline-block animate-pulse">Loading...</span>
//       `;
//     } else {
//       this.startButton.disabled = false;
//       this.startButton.innerHTML = 'Start Quiz';
//     }
//   }
  
//   updateProgress(current, total, percentage) {
//     this.questionNumber.textContent = `Question ${current} of ${total}`;
//     this.progressPercent.textContent = `${Math.round(percentage)}% Complete`;
//     this.progressBar.style.width = `${percentage}%`;
//   }
  
//   setQuestionText(text) {
//     this.questionText.innerHTML = text;
//   }
  
//   renderOptions(options, onSelect) {
//     this.optionsContainer.innerHTML = '';
    
//     options.forEach((option, index) => {
//       const button = document.createElement('button');
//       button.className = 'option-btn';
//       button.innerHTML = option;
//       button.addEventListener('click', () => onSelect(index));
      
//       this.optionsContainer.appendChild(button);
//     });
    
//     // Reset explanation state for new question
//     this.isExplanationShown = false;
//   }
  
//   showAnswerFeedback(selectedIndex, correctIndex) {
//     const optionButtons = this.optionsContainer.querySelectorAll('button');
    
//     optionButtons.forEach((button, index) => {
//       button.disabled = true;
      
//       if (index === correctIndex) {
//         button.classList.add('correct-answer');
//       }
      
//       if (index === selectedIndex && selectedIndex !== correctIndex) {
//         button.classList.add('incorrect-answer');
//       }
//     });
    
//     // Set flag that current question has been answered
//     this.isExplanationShown = true;
//   }
  
//   showExplanation(explanation) {
//     // Only show explanation if current question has been answered
//     if (this.isExplanationShown) {
//       this.explanationText.innerHTML = explanation;
//       this.explanationContainer.classList.remove('hidden');
//     }
//   }
  
//   hideExplanation() {
//     this.explanationContainer.classList.add('hidden');
//     this.isExplanationShown = false;
//   }
  
//   updateScore(score, total, percentage) {
//     this.scorePercent.textContent = `${percentage}%`;
//     this.scorePercent.className = `text-5xl font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}`;
//     this.scoreText.textContent = `You scored ${score} out of ${total}`;
    
//     // Feedback message
//     if (percentage >= 80) {
//       this.feedbackMessage.textContent = 'Excellent! You\'re well-prepared for your interview!';
//     } else if (percentage >= 60) {
//       this.feedbackMessage.textContent = 'Good job! With a bit more study, you\'ll be fully prepared.';
//     } else {
//       this.feedbackMessage.textContent = 'Keep practicing! Review the questions you missed and try again.';
//     }
//   }
  
//   showPerformanceAnalysis(analysis) {
//     const analysisContent = document.getElementById('analysis-content');
    
//     let html = `
//       <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div class="p-4 bg-white rounded shadow">
//           <h4 class="font-bold text-indigo-900 mb-2">Time Statistics</h4>
//           <p class="text-gray-700">Average time per question: ${Math.round(analysis.averageTimePerQuestion)}s</p>
//           <p class="text-gray-700">Average time for correct answers: ${Math.round(analysis.averageTimeCorrect)}s</p>
//           <p class="text-gray-700">Average time for incorrect answers: ${Math.round(analysis.averageTimeIncorrect)}s</p>
//         </div>
        
//         <div class="p-4 bg-white rounded shadow">
//           <h4 class="font-bold text-indigo-900 mb-2">Areas to Improve</h4>
//           ${analysis.weakAreas.length ? 
//             `<p class="text-gray-700 mb-2">Focus on these topics:</p>
//              <ul class="list-disc pl-5 text-gray-700">
//                ${analysis.weakAreas.map(area => `<li>${area}</li>`).join('')}
//              </ul>` : 
//             '<p class="text-green-600">Great job! No specific weak areas identified.</p>'}
//         </div>
//       </div>
      
//       <div class="p-4 bg-white rounded shadow">
//         <h4 class="font-bold text-indigo-900 mb-3">Category Performance</h4>
//         <div class="space-y-3">
//     `;
    
//     Object.entries(analysis.categoryPerformance).forEach(([category, stats]) => {
//       const percentage = Math.round((stats.correct / stats.total) * 100);
//       const colorClass = percentage >= 70 ? 'good' : percentage >= 40 ? 'average' : 'poor';
      
//       html += `
//         <div>
//           <div class="flex justify-between text-sm mb-1">
//             <span class="font-medium text-gray-700">${category}</span>
//             <span class="text-gray-700">${stats.correct}/${stats.total} (${percentage}%)</span>
//           </div>
//           <div class="performance-bar">
//             <div class="performance-bar-fill ${colorClass}" style="width: ${percentage}%"></div>
//           </div>
//         </div>
//       `;
//     });
    
//     html += `
//         </div>
//       </div>
//     `;
    
//     analysisContent.innerHTML = html;
//   }
  
//   showQuestionReview(questions, userAnswers) {
//     const reviewContainer = document.getElementById('review-questions');
//     reviewContainer.innerHTML = '';
    
//     userAnswers.forEach((answer, index) => {
//       const question = questions[index];
//       const isCorrect = answer.isCorrect;
      
//       const reviewItem = document.createElement('div');
//       reviewItem.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
      
//       reviewItem.innerHTML = `
//         <div class="flex justify-between mb-2">
//           <span class="font-medium">${index + 1}. ${question.question}</span>
//           <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium">
//             ${isCorrect ? 'Correct' : 'Incorrect'}
//           </span>
//         </div>
//         <div class="text-sm text-gray-700 mb-2">
//           <p>Your answer: ${answer.userAnswer >= 0 ? question.options[answer.userAnswer] : 'Time expired'}</p>
//           <p>Correct answer: ${question.options[question.correctAnswer]}</p>
//           <p>Time spent: ${answer.timeSpent} seconds</p>
//         </div>
//         ${question.explanation ? 
//           `<div class="text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200">
//             <strong>Explanation:</strong> ${question.explanation}
//           </div>` : ''}
//       `;
      
//       reviewContainer.appendChild(reviewItem);
//     });
//   }
  
//   updateTimer(seconds) {
//     if (this.timerDisplay) {
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
      
//       // Display in MM:SS format for better readability
//       const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//       this.timerDisplay.textContent = formattedTime;
      
//       // Apply warning styles when time is running low
//       if (seconds <= 5) {
//         this.timerDisplay.classList.add('text-red-600', 'animate-pulse');
//       } else if (seconds <= 10) {
//         this.timerDisplay.classList.add('text-orange-500');
//         this.timerDisplay.classList.remove('text-red-600', 'animate-pulse');
//       } else {
//         this.timerDisplay.classList.remove('text-red-600', 'text-orange-500', 'animate-pulse');
//       }
//     }
//   }
  
//   showToast(message, type = 'info', duration = 3000) {
//     const toast = document.createElement('div');
//     toast.className = `toast ${type}`;
//     toast.textContent = message;
    
//     this.toastContainer.appendChild(toast);
    
//     setTimeout(() => {
//       toast.classList.add('animate-fade-out');
//       setTimeout(() => {
//         this.toastContainer.removeChild(toast);
//       }, 300);
//     }, duration);
//   }
  
//   showResumePrompt(onYes, onNo) {
//     this.resumeDialog.classList.remove('hidden');
    
//     const yesButton = document.getElementById('resume-yes');
//     const noButton = document.getElementById('resume-no');
    
//     const handleYes = () => {
//       this.resumeDialog.classList.add('hidden');
//       yesButton.removeEventListener('click', handleYes);
//       noButton.removeEventListener('click', handleNo);
//       onYes();
//     };
    
//     const handleNo = () => {
//       this.resumeDialog.classList.add('hidden');
//       yesButton.removeEventListener('click', handleYes);
//       noButton.removeEventListener('click', handleNo);
//       onNo();
//     };
    
//     yesButton.addEventListener('click', handleYes);
//     noButton.addEventListener('click', handleNo);
//   }
// }


export class UIManager {
  constructor() {
    // Main containers
    this.startScreen = document.getElementById('start-screen') || this.createFallbackElement('div', 'start-screen');
    this.questionScreen = document.getElementById('question-screen') || this.createFallbackElement('div', 'question-screen');
    this.resultScreen = document.getElementById('result-screen') || this.createFallbackElement('div', 'result-screen');
    this.quizContainer = document.getElementById('quiz-container') || this.createFallbackElement('div', 'quiz-container');
    
    // Question screen elements
    this.questionNumber = document.getElementById('question-number') || this.createFallbackElement('div', 'question-number');
    this.progressPercent = document.getElementById('progress-percent') || this.createFallbackElement('div', 'progress-percent');
    this.progressBar = document.getElementById('progress-bar') || this.createFallbackElement('div', 'progress-bar');
    this.questionText = document.getElementById('question-text') || this.createFallbackElement('div', 'question-text');
    this.optionsContainer = document.getElementById('options-container') || this.createFallbackElement('div', 'options-container');
    this.explanationContainer = document.getElementById('explanation-container') || this.createFallbackElement('div', 'explanation-container');
    this.explanationText = document.getElementById('explanation-text') || this.createFallbackElement('div', 'explanation-text');
    this.timerDisplay = document.getElementById('timer-display') || this.createFallbackElement('div', 'timer-display');
    
    // Result screen elements
    this.scorePercent = document.getElementById('score-percent') || this.createFallbackElement('div', 'score-percent');
    this.scoreText = document.getElementById('score-text') || this.createFallbackElement('div', 'score-text');
    this.feedbackMessage = document.getElementById('feedback-message') || this.createFallbackElement('div', 'feedback-message');
    this.analysisContent = document.getElementById('analysis-content') || this.createFallbackElement('div', 'analysis-content');
    this.reviewQuestions = document.getElementById('review-questions') || this.createFallbackElement('div', 'review-questions');
    
    // Buttons
    this.startButton = document.getElementById('start-button') || this.createFallbackElement('button', 'start-button');
    this.restartButton = document.getElementById('restart-button') || this.createFallbackElement('button', 'restart-button');
    this.changeTopicButton = document.getElementById('change-topic-button') || this.createFallbackElement('button', 'change-topic-button');
    this.shareButton = document.getElementById('share-button') || this.createFallbackElement('button', 'share-button');
    this.pauseButton = document.getElementById('pause-button') || this.createFallbackElement('button', 'pause-button');
    
    // Toast container
    this.toastContainer = document.getElementById('toast-container') || this.createFallbackElement('div', 'toast-container');
    
    // Resume dialog
    this.resumeDialog = document.getElementById('resume-dialog') || this.createFallbackElement('div', 'resume-dialog');
    
    // Track if explanation is shown
    this.isExplanationShown = false;
    
    // Track animation state
    this.animationInProgress = false;
    
    // Initialize keyboard shortcuts
    this.initKeyboardShortcuts();
    
    // Initialize touch gestures
    this.initTouchGestures();
    
    // Initialize theme toggle
    this.initThemeToggle();
    
    // Initialize accessibility features
    this.initAccessibility();
  }
  
  createFallbackElement(type, id) {
    const element = document.createElement(type);
    element.id = id;
    document.body.appendChild(element);
    console.warn(`Element with id '${id}' not found, created fallback element`);
    return element;
  }
  
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Number keys 1-4 for selecting options
      if (this.questionScreen && !this.questionScreen.classList.contains('hidden')) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          const options = this.optionsContainer.querySelectorAll('button:not([disabled])');
          if (options.length >= num) {
            options[num - 1].click();
          }
        }
      }
      
      // Space bar to start/pause/resume
      if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        if (!this.questionScreen.classList.contains('hidden') && this.pauseButton) {
          this.pauseButton.click();
        } else if (!this.startScreen.classList.contains('hidden') && !this.startButton.disabled) {
          this.startButton.click();
        }
      }
      
      // Escape key to pause
      if (e.code === 'Escape' && !this.questionScreen.classList.contains('hidden') && this.pauseButton) {
        if (this.pauseButton.dataset.state === 'running') {
          this.pauseButton.click();
        }
      }
    });
  }
  
  initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }
  
  handleSwipe(startX, endX) {
    const swipeThreshold = 100;
    const swipeDistance = endX - startX;
    
    // Only handle swipes if we're in the question screen
    if (this.questionScreen && !this.questionScreen.classList.contains('hidden')) {
      if (swipeDistance > swipeThreshold && this.isExplanationShown) {
        // Right swipe - go to next question if explanation is shown
        const nextButton = document.querySelector('.next-btn');
        if (nextButton) nextButton.click();
      } else if (swipeDistance < -swipeThreshold && !this.isExplanationShown) {
        // Left swipe - show explanation if not already shown
        this.showExplanation(this.currentExplanation);
      }
    }
  }
  
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Check for saved theme preference or use preferred color scheme
      const savedTheme = localStorage.getItem('quiz-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.checked = true;
      }
      
      themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
          document.documentElement.classList.add('dark-theme');
          localStorage.setItem('quiz-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark-theme');
          localStorage.setItem('quiz-theme', 'light');
        }
      });
    }
  }
  
  initAccessibility() {
    // Add ARIA attributes to improve screen reader experience
    this.optionsContainer.setAttribute('role', 'radiogroup');
    this.optionsContainer.setAttribute('aria-labelledby', 'question-text');
    
    // Add focus trap for modal dialogs
    this.resumeDialog.setAttribute('role', 'dialog');
    this.resumeDialog.setAttribute('aria-modal', 'true');
    
    // Add font size controls if they exist
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    
    if (increaseFontBtn) {
      increaseFontBtn.addEventListener('click', () => this.changeFontSize(1));
    }
    
    if (decreaseFontBtn) {
      decreaseFontBtn.addEventListener('click', () => this.changeFontSize(-1));
    }
  }
  
  changeFontSize(step) {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const newSize = Math.max(12, Math.min(24, currentSize + step)); // Limit between 12px and 24px
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('quiz-font-size', newSize);
    this.showToast(`Font size: ${newSize}px`, 'info', 1000);
  }
  
  bindStartButton(callback) {
    if (this.startButton) {
      this.startButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateButton(this.startButton);
        callback();
      });
    }
  }
  
  bindRestartButton(callback) {
    if (this.restartButton) {
      this.restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateButton(this.restartButton);
        callback();
      });
    }
  }
  
  bindChangeTopic(callback) {
    if (this.changeTopicButton) {
      this.changeTopicButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateButton(this.changeTopicButton);
        callback();
      });
    }
  }
  
  bindShareButton(callback) {
    if (this.shareButton) {
      this.shareButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateButton(this.shareButton);
        
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
    if (this.pauseButton) {
      this.pauseButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateButton(this.pauseButton);
        
        if (this.pauseButton.dataset.state === 'running') {
          this.pauseButton.dataset.state = 'paused';
          this.pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
          this.pauseButton.setAttribute('aria-label', 'Resume quiz');
          pauseCallback();
        } else {
          this.pauseButton.dataset.state = 'running';
          this.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
          this.pauseButton.setAttribute('aria-label', 'Pause quiz');
          resumeCallback();
        }
      });
    }
  }
  
  animateButton(button) {
    if (!button) return;
    
    button.classList.add('btn-pulse');
    setTimeout(() => {
      button.classList.remove('btn-pulse');
    }, 300);
  }
  
  showStartScreen() {
    this.fadeOut(this.questionScreen);
    this.fadeOut(this.resultScreen);
    this.fadeIn(this.startScreen);
    
    // Ensure focus is set for accessibility
    setTimeout(() => {
      if (this.startButton) this.startButton.focus();
    }, 100);
  }
  
  showQuestionScreen() {
    this.fadeOut(this.startScreen);
    this.fadeOut(this.resultScreen);
    this.fadeIn(this.questionScreen);
    
    // Hide explanation when showing a new question
    this.hideExplanation();
    
    // Reset pause button if exists
    if (this.pauseButton) {
      this.pauseButton.dataset.state = 'running';
      this.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
      this.pauseButton.setAttribute('aria-label', 'Pause quiz');
    }
    
    // Ensure focus is set to the question for screen readers
    setTimeout(() => {
      this.questionText.focus();
      this.questionText.setAttribute('tabindex', '-1');
    }, 100);
  }
  
  showResultScreen() {
    this.fadeOut(this.startScreen);
    this.fadeOut(this.questionScreen);
    this.fadeIn(this.resultScreen);
    
    // Animate score counter
    this.animateScoreCounter();
    
    // Ensure focus is set for accessibility
    setTimeout(() => {
      if (this.scoreText) this.scoreText.focus();
      this.scoreText.setAttribute('tabindex', '-1');
    }, 100);
  }
  
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
  
  showLoadingState(isLoading) {
    if (!this.startButton) return;
    
    if (isLoading) {
      this.startButton.disabled = true;
      this.startButton.innerHTML = `
        <span class="inline-block animate-pulse">Loading...</span>
        <div class="loading-spinner"></div>
      `;
      this.startButton.setAttribute('aria-busy', 'true');
    } else {
      this.startButton.disabled = false;
      this.startButton.innerHTML = 'Start Quiz';
      this.startButton.removeAttribute('aria-busy');
    }
  }
  
  updateProgress(current, total, percentage) {
    if (this.questionNumber) {
      this.questionNumber.textContent = `Question ${current} of ${total}`;
    }
    
    if (this.progressPercent) {
      this.progressPercent.textContent = `${Math.round(percentage)}% Complete`;
    }
    
    if (this.progressBar) {
      // Animate the progress bar
      const currentWidth = parseFloat(this.progressBar.style.width) || 0;
      this.animateProgressBar(currentWidth, percentage);
    }
    
    // Announce progress for screen readers
    this.announceForScreenReader(`Question ${current} of ${total}, ${Math.round(percentage)}% complete`);
  }
  
  animateProgressBar(fromPercent, toPercent) {
    const duration = 500; // ms
    const start = performance.now();
    
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = fromPercent + (toPercent - fromPercent) * progress;
      this.progressBar.style.width = `${currentPercent}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  setQuestionText(text) {
    if (!this.questionText) return;
    
    // Add fade effect when changing question text
    this.questionText.classList.add('fade-out');
    
    setTimeout(() => {
      this.questionText.innerHTML = text;
      this.questionText.classList.remove('fade-out');
      this.questionText.classList.add('fade-in');
      
      setTimeout(() => {
        this.questionText.classList.remove('fade-in');
      }, 300);
    }, 300);
  }
  
  renderOptions(options, onSelect) {
    if (!this.optionsContainer) return;
    
    // Clear existing options with fade effect
    const existingOptions = this.optionsContainer.querySelectorAll('.option-btn');
    if (existingOptions.length > 0) {
      existingOptions.forEach(btn => btn.classList.add('fade-out'));
      
      setTimeout(() => {
        this.optionsContainer.innerHTML = '';
        this.renderNewOptions(options, onSelect);
      }, 300);
    } else {
      this.renderNewOptions(options, onSelect);
    }
    
    // Reset explanation state for new question
    this.isExplanationShown = false;
  }
  
  renderNewOptions(options, onSelect) {
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn fade-in';
      button.innerHTML = option;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');
      button.setAttribute('data-index', index);
      button.setAttribute('aria-label', `Option ${index + 1}: ${this.stripHtml(option)}`);
      
      // Add keyboard shortcut hint
      const shortcutHint = document.createElement('span');
      shortcutHint.className = 'shortcut-hint';
      shortcutHint.textContent = `${index + 1}`;
      button.appendChild(shortcutHint);
      
      button.addEventListener('click', () => {
        this.animateButton(button);
        onSelect(index);
      });
      
      this.optionsContainer.appendChild(button);
      
      // Remove fade-in class after animation completes
      setTimeout(() => {
        button.classList.remove('fade-in');
      }, 300);
    });
  }
  
  stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }
  
  showAnswerFeedback(selectedIndex, correctIndex) {
    if (!this.optionsContainer) return;
    
    const optionButtons = this.optionsContainer.querySelectorAll('button');
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
    
    // Add next button if it doesn't exist
    if (!document.querySelector('.next-btn')) {
      const nextButton = document.createElement('button');
      nextButton.className = 'next-btn fade-in';
      nextButton.innerHTML = 'Next Question <i class="fas fa-arrow-right"></i>';
      nextButton.setAttribute('aria-label', 'Go to next question');
      
      // Add keyboard shortcut hint
      const shortcutHint = document.createElement('span');
      shortcutHint.className = 'shortcut-hint';
      shortcutHint.textContent = 'N';
      nextButton.appendChild(shortcutHint);
      
      this.optionsContainer.appendChild(nextButton);
      
      // Add keyboard shortcut for next button
      const handleNextShortcut = (e) => {
        if (e.key === 'n' || e.key === 'N') {
          nextButton.click();
          document.removeEventListener('keydown', handleNextShortcut);
        }
      };
      
      document.addEventListener('keydown', handleNextShortcut);
      
      // Focus the next button for accessibility
      setTimeout(() => {
        nextButton.focus();
      }, 100);
    }
    
    // Set flag that current question has been answered
    this.isExplanationShown = true;
    
    // Announce result for screen readers
    const isCorrect = selectedIndex === correctIndex;
    this.announceForScreenReader(isCorrect ? 'Correct answer!' : 'Incorrect answer. The correct answer is: ' + 
      this.stripHtml(optionButtons[correctIndex].innerHTML));
  }
  
  showExplanation(explanation) {
    // Store current explanation for potential later use
    this.currentExplanation = explanation;
    
    // Only show explanation if current question has been answered
    if (this.isExplanationShown && this.explanationContainer && this.explanationText) {
      this.explanationText.innerHTML = explanation;
      
      // Add fade-in effect
      this.explanationContainer.classList.add('fade-in');
      this.explanationContainer.classList.remove('hidden');
      
      setTimeout(() => {
        this.explanationContainer.classList.remove('fade-in');
      }, 300);
      
      // Scroll to explanation
      this.explanationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Announce for screen readers
      this.announceForScreenReader('Explanation: ' + this.stripHtml(explanation));
    }
  }
  
  hideExplanation() {
    if (this.explanationContainer) {
      // Add fade-out effect
      this.explanationContainer.classList.add('fade-out');
      
      setTimeout(() => {
        this.explanationContainer.classList.add('hidden');
        this.explanationContainer.classList.remove('fade-out');
      }, 300);
    }
    
    this.isExplanationShown = false;
  }
  
  updateScore(score, total, percentage) {
    if (!this.scorePercent || !this.scoreText || !this.feedbackMessage) return;
    
    // Store the values for animation
    this.finalScore = score;
    this.totalQuestions = total;
    this.scorePercentage = percentage;
    
    // Set initial values for animation
    this.scorePercent.textContent = '0%';
    this.scorePercent.className = `text-5xl font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}`;
    this.scoreText.textContent = `You scored 0 out of ${total}`;
    
    // Feedback message with appropriate emoji
    let emoji = '';
    let feedbackText = '';
    
    if (percentage >= 90) {
      emoji = '🏆';
      feedbackText = 'Outstanding! You\'re an expert!';
    } else if (percentage >= 80) {
      emoji = '🌟';
      feedbackText = 'Excellent! You\'re well-prepared for your interview!';
    } else if (percentage >= 70) {
      emoji = '👍';
      feedbackText = 'Great job! You\'re on the right track!';
    } else if (percentage >= 60) {
      emoji = '😊';
      feedbackText = 'Good job! With a bit more study, you\'ll be fully prepared.';
    } else if (percentage >= 40) {
      emoji = '📚';
      feedbackText = 'Keep studying! Review the questions you missed.';
    } else {
      emoji = '💪';
      feedbackText = 'Keep practicing! Review the questions and try again.';
    }
    
    this.feedbackMessage.innerHTML = `<span class="feedback-emoji">${emoji}</span> ${feedbackText}`;
    
    // Add confetti effect for good scores
    if (percentage >= 70) {
      this.showConfetti();
    }
  }
  
  animateScoreCounter() {
    if (!this.scorePercent || !this.scoreText) return;
    if (this.animationInProgress) return;
    
    this.animationInProgress = true;
    
    const duration = 2000; // ms
    const start = performance.now();
    let currentScore = 0;
    let currentPercentage = 0;
    
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      currentScore = Math.round(this.finalScore * easeOutQuart);
      currentPercentage = Math.round(this.scorePercentage * easeOutQuart);
      
      this.scorePercent.textContent = `${currentPercentage}%`;
      this.scoreText.textContent = `You scored ${currentScore} out of ${this.totalQuestions}`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animationInProgress = false;
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
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50'];
    const confettiCount = 150;
    
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      
      confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  showPerformanceAnalysis(analysis) {
    if (!this.analysisContent) return;
    
    let html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 analysis-section fade-in">
        <div class="p-4 bg-white rounded shadow">
          <h4 class="font-bold text-indigo-900 mb-2">Time Statistics</h4>
          <div class="time-stats">
            <div class="stat-item">
              <span class="stat-label">Average time per question:</span>
              <span class="stat-value">${Math.round(analysis.averageTimePerQuestion)}s</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Average time for correct answers:</span>
              <span class="stat-value">${Math.round(analysis.averageTimeCorrect)}s</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Average time for incorrect answers:</span>
              <span class="stat-value">${Math.round(analysis.averageTimeIncorrect)}s</span>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-white rounded shadow">
          <h4 class="font-bold text-indigo-900 mb-2">Areas to Improve</h4>
          ${analysis.weakAreas.length ?
            `<p class="text-gray-700 mb-2">Focus on these topics:</p>
             <ul class="list-disc pl-5 text-gray-700 weak-areas-list">
               ${analysis.weakAreas.map(area => `<li>${area}</li>`).join('')}
             </ul>` :
             '<p class="text-green-600">Great job! No specific weak areas identified.</p>'}
        </div>
      </div>
      
      <div class="p-4 bg-white rounded shadow analysis-section fade-in" style="animation-delay: 0.2s">
        <h4 class="font-bold text-indigo-900 mb-3">Category Performance</h4>
        <div class="space-y-3 category-performance">
    `;
    
    Object.entries(analysis.categoryPerformance).forEach(([category, stats]) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      const colorClass = percentage >= 70 ? 'good' : percentage >= 40 ? 'average' : 'poor';
      
      html += `
        <div class="category-item">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-gray-700">${category}</span>
            <span class="text-gray-700">${stats.correct}/${stats.total} (${percentage}%)</span>
          </div>
          <div class="performance-bar">
            <div class="performance-bar-fill ${colorClass}" style="width: 0%"></div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    this.analysisContent.innerHTML = html;
    
    // Animate performance bars after rendering
    setTimeout(() => {
      const bars = document.querySelectorAll('.performance-bar-fill');
      Object.entries(analysis.categoryPerformance).forEach(([category, stats], index) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        if (bars[index]) {
          setTimeout(() => {
            bars[index].style.width = `${percentage}%`;
          }, index * 100);
        }
      });
    }, 500);
  }
  
  showQuestionReview(questions, userAnswers) {
    if (!this.reviewQuestions) return;
    
    this.reviewQuestions.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
      const question = questions[index];
      const isCorrect = answer.isCorrect;
      
      const reviewItem = document.createElement('div');
      reviewItem.className = `review-question ${isCorrect ? 'correct' : 'incorrect'} fade-in`;
      reviewItem.style.animationDelay = `${index * 100}ms`;
      reviewItem.style.animationDelay = `${index * 0.1}s`;
      
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
            ${answer.userAnswer >= 0 ? 
              `<span class="${isCorrect ? 'text-green-600' : 'text-red-600'}">${question.options[answer.userAnswer]}</span>` : 
              '<span class="text-orange-500"><i class="fas fa-clock"></i> Time expired</span>'}
          </p>
          <p class="correct-answer">
            <strong>Correct answer:</strong> 
            <span class="text-green-600">${question.options[question.correctAnswer]}</span>
          </p>
          <p class="time-spent">
            <strong><i class="fas fa-stopwatch"></i> Time spent:</strong> ${answer.timeSpent} seconds
          </p>
        </div>
        ${question.explanation ?
          `<div class="text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200 explanation-text">
            <div class="explanation-toggle" data-index="${index}">
              <i class="fas fa-lightbulb"></i> <strong>Show Explanation</strong>
            </div>
            <div class="explanation-content hidden" id="explanation-${index}">
              ${question.explanation}
            </div>
          </div>` : ''}
      `;
      
      this.reviewQuestions.appendChild(reviewItem);
      
      // Remove fade-in class after animation completes
      setTimeout(() => {
        reviewItem.classList.remove('fade-in');
      }, 500 + index * 100);
    });
    
    // Add event listeners for explanation toggles
    const toggles = this.reviewQuestions.querySelectorAll('.explanation-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const index = toggle.dataset.index;
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
      this.reviewQuestions.parentNode.insertBefore(filterContainer, this.reviewQuestions);
      
      // Add event listeners to filter buttons
      const filterButtons = filterContainer.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Apply filter
          const filter = btn.dataset.filter;
          const questions = this.reviewQuestions.querySelectorAll('.review-question');
          
          questions.forEach(q => {
            if (filter === 'all') {
              q.classList.remove('hidden');
            } else if (filter === 'correct') {
              q.classList.toggle('hidden', !q.classList.contains('correct'));
            } else if (filter === 'incorrect') {
              q.classList.toggle('hidden', !q.classList.contains('incorrect'));
            }
          });
          
          // Announce for screen readers
          this.announceForScreenReader(`Showing ${filter} questions`);
        });
      });
    }
  }
  
  updateTimer(seconds) {
    if (!this.timerDisplay) return;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Display in MM:SS format for better readability
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    
    // Only update DOM if the value has changed
    if (this.timerDisplay.textContent !== formattedTime) {
      this.timerDisplay.textContent = formattedTime;
      
      // Apply warning styles when time is running low
      if (seconds <= 5) {
        this.timerDisplay.classList.add('text-red-600', 'animate-pulse');
        
        // Add beep sound for last 5 seconds if not already beeping
        if (!this.isBeeping && seconds > 0) {
          this.isBeeping = true;
          this.playTimerSound();
        }
      } else if (seconds <= 10) {
        this.timerDisplay.classList.add('text-orange-500');
        this.timerDisplay.classList.remove('text-red-600', 'animate-pulse');
        this.isBeeping = false;
      } else {
        this.timerDisplay.classList.remove('text-red-600', 'text-orange-500', 'animate-pulse');
        this.isBeeping = false;
      }
      
      // Announce time for screen readers at specific intervals
      if (seconds === 30 || seconds === 15 || seconds === 10 || seconds === 5) {
        this.announceForScreenReader(`${seconds} seconds remaining`);
      }
    }
  }
  
  playTimerSound() {
    // Create audio context if supported
    if (window.AudioContext || window.webkitAudioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      // Create oscillator for beep sound
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    }
  }
  
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} fade-in`;
    
    // Add appropriate icon based on type
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i class="fas fa-check-circle"></i>';
        break;
      case 'error':
        icon = '<i class="fas fa-exclamation-circle"></i>';
        break;
      case 'warning':
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        break;
      default:
        icon = '<i class="fas fa-info-circle"></i>';
    }
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismissToast(toast);
    });
    
    // Auto dismiss after duration
    const timeoutId = setTimeout(() => {
      this.dismissToast(toast);
    }, duration);
    
    // Store timeout ID to allow manual dismissal
    toast.dataset.timeoutId = timeoutId;
    
    // Announce for screen readers
    this.announceForScreenReader(`${type} notification: ${message}`);
    
    return toast;
  }
  
  dismissToast(toast) {
    // Clear the timeout if it exists
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    
    toast.classList.add('animate-fade-out');
    toast.classList.remove('fade-in');
    
    setTimeout(() => {
      if (toast.parentNode === this.toastContainer) {
        this.toastContainer.removeChild(toast);
      }
    }, 300);
  }
  
  showResumePrompt(onYes, onNo) {
    if (!this.resumeDialog) return;
    
    // Add fade-in effect
    this.resumeDialog.classList.add('fade-in');
    this.resumeDialog.classList.remove('hidden');
    
    setTimeout(() => {
      this.resumeDialog.classList.remove('fade-in');
    }, 300);
    
    const yesButton = document.getElementById('resume-yes');
    const noButton = document.getElementById('resume-no');
    
    if (!yesButton || !noButton) return;
    
    const handleYes = () => {
      this.dismissResumeDialog();
      yesButton.removeEventListener('click', handleYes);
      noButton.removeEventListener('click', handleNo);
      onYes();
    };
    
    const handleNo = () => {
      this.dismissResumeDialog();
      yesButton.removeEventListener('click', handleYes);
      noButton.removeEventListener('click', handleNo);
      onNo();
    };
    
    yesButton.addEventListener('click', handleYes);
    noButton.addEventListener('click', handleNo);
    
    // Add keyboard support
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        handleNo();
        document.removeEventListener('keydown', handleKeydown);
      } else if (e.key === 'Enter') {
        handleYes();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Focus yes button for accessibility
    setTimeout(() => {
      yesButton.focus();
    }, 100);
  }
  
  dismissResumeDialog() {
    if (!this.resumeDialog) return;
    
    this.resumeDialog.classList.add('fade-out');
    
    setTimeout(() => {
      this.resumeDialog.classList.add('hidden');
      this.resumeDialog.classList.remove('fade-out');
    }, 300);
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
  
  exportResultsAsPDF() {
    // Check if we have the required data
    if (!this.scoreText || !this.feedbackMessage) {
      this.showToast('Cannot generate PDF: Missing quiz results', 'error');
      return;
    }
    
    this.showToast('Preparing PDF for download...', 'info');
    
    // Use html2pdf or similar library if available
    if (typeof html2pdf !== 'undefined') {
      const content = document.getElementById('result-content') || this.resultScreen;
      
      const opt = {
        margin: 10,
        filename: 'quiz-results.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(content).save().then(() => {
        this.showToast('PDF downloaded successfully!', 'success');
      }).catch(err => {
        console.error('PDF generation error:', err);
        this.showToast('Failed to generate PDF', 'error');
      });
    } else {
      this.showToast('PDF generation library not available', 'error');
    }
  }
  
  // Method to enable sharing results
  shareResults(score, total, topic) {
    const percentage = Math.round((score / total) * 100);
    const text = `I scored ${score}/${total} (${percentage}%) on the ${topic} quiz!`;
    const url = window.location.href;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: 'My Quiz Results',
        text: text,
        url: url
      })
      .then(() => this.showToast('Shared successfully!', 'success'))
      .catch(err => {
        console.error('Share error:', err);
        this.showToast('Could not share results', 'error');
      });
    } else {
      // Fallback to clipboard
      const fullText = `${text}\nTry it yourself: ${url}`;
      
      navigator.clipboard.writeText(fullText)
        .then(() => this.showToast('Results copied to clipboard!', 'success'))
        .catch(() => this.showToast('Could not copy to clipboard', 'error'));
    }
  }
}

