// export class QuizManager {
//     constructor(questions, uiManager, quizType = 'js', difficulty = 'easy') {
//       this.questions = questions;
//       this.uiManager = uiManager;
//       this.quizType = quizType;
//       this.difficulty = difficulty;
//       this.currentQuestion = 0;
//       this.score = 0;
//       this.userAnswers = [];
//       this.timer = null;
//       this.timeRemaining = null;
//       this.timePerQuestion = this.getTimePerDifficulty(difficulty);
//       this.shuffledQuestions = [...questions]; // Will be shuffled on start
//     }
  
//     getTimePerDifficulty(difficulty) {
//       switch(difficulty) {
//         case 'easy': return 30; // 30 seconds for easy questions
//         case 'medium': return 45; // 45 seconds for medium questions
//         case 'hard': return 60; // 60 seconds for hard questions
//         default: return 30;
//       }
//     }
  
//     startQuiz() {
//       this.shuffleQuestions();
//       this.uiManager.showQuestionScreen();
//       this.loadQuestion();
//       this.startTimer();
//       this.saveState();
//     }
  
//     restartQuiz() {
//       this.currentQuestion = 0;
//       this.score = 0;
//       this.userAnswers = [];
//       this.shuffleQuestions();
//       this.uiManager.showQuestionScreen();
//       this.loadQuestion();
//       this.startTimer();
//       this.saveState();
//     }
  
//     shuffleQuestions() {
//       // Fisher-Yates shuffle algorithm
//       for (let i = this.shuffledQuestions.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [this.shuffledQuestions[i], this.shuffledQuestions[j]] = 
//         [this.shuffledQuestions[j], this.shuffledQuestions[i]];
//       }
      
//       // Limit number of questions based on difficulty
//       const maxQuestions = {
//         easy: 10,
//         medium: 15,
//         hard: 20
//       };
      
//       const limit = maxQuestions[this.difficulty] || 10;
//       if (this.shuffledQuestions.length > limit) {
//         this.shuffledQuestions = this.shuffledQuestions.slice(0, limit);
//       }
//     }
  
//     loadQuestion() {
//       const question = this.shuffledQuestions[this.currentQuestion];
//       const totalQuestions = this.shuffledQuestions.length;
//       const progress = (this.currentQuestion / totalQuestions) * 100;
      
//       this.uiManager.updateProgress(this.currentQuestion + 1, totalQuestions, progress);
//       this.uiManager.setQuestionText(question.question);
//       this.uiManager.renderOptions(question.options, (selectedIndex) => 
//         this.handleAnswer(selectedIndex)
//       );
      
//       this.resetTimer();
//       this.saveState();
//     }
  
//     handleAnswer(selectedIndex) {
//       clearInterval(this.timer);
      
//       const question = this.shuffledQuestions[this.currentQuestion];
//       const correct = selectedIndex === question.correctAnswer;
      
//       // Store user's answer for review later
//       this.userAnswers.push({
//         questionIndex: this.shuffledQuestions[this.currentQuestion].id || this.currentQuestion,
//         userAnswer: selectedIndex,
//         correctAnswer: question.correctAnswer,
//         isCorrect: correct,
//         timeSpent: this.timePerQuestion - this.timeRemaining,
//         category: question.category || 'general'
//       });
      
//       this.uiManager.showAnswerFeedback(selectedIndex, question.correctAnswer);
      
//       if (question.explanation) {
//         this.uiManager.showExplanation(question.explanation);
//       }
      
//       if (correct) {
//         this.score++;
//       }
      
//       this.saveState();
      
//       setTimeout(() => this.moveToNextQuestion(), 2000);
//     }
  
//     moveToNextQuestion() {
//       this.currentQuestion++;
      
//       if (this.currentQuestion < this.shuffledQuestions.length) {
//         this.loadQuestion();
//       } else {
//         this.showResults();
//       }
//     }
  
//     showResults() {
//       this.uiManager.showResultScreen();
      
//       const percentage = Math.round((this.score / this.shuffledQuestions.length) * 100);
//       this.uiManager.updateScore(this.score, this.shuffledQuestions.length, percentage);
      
//       // Generate detailed performance analysis
//       const analysis = this.generatePerformanceAnalysis();
//       this.uiManager.showPerformanceAnalysis(analysis);
      
//       // Generate review of questions
//       this.uiManager.showQuestionReview(this.shuffledQuestions, this.userAnswers);
      
//       // Clear saved state as quiz is complete
//       localStorage.removeItem('quizState');
//     }
  
//     generatePerformanceAnalysis() {
//       // Calculate time statistics
//       const timeStats = this.userAnswers.reduce((stats, answer) => {
//         stats.totalTime += answer.timeSpent;
//         if (answer.isCorrect) {
//           stats.correctTime += answer.timeSpent;
//           stats.correctCount++;
//         } else {
//           stats.incorrectTime += answer.timeSpent;
//           stats.incorrectCount++;
//         }
//         return stats;
//       }, { totalTime: 0, correctTime: 0, incorrectTime: 0, correctCount: 0, incorrectCount: 0 });
      
//       // Find categories of questions the user struggled with
//       const categoryStats = {};
//       this.userAnswers.forEach(answer => {
//         const question = this.shuffledQuestions.find((q, index) => 
//           index === this.userAnswers.indexOf(answer)
//         );
        
//         if (question && question.category) {
//           if (!categoryStats[question.category]) {
//             categoryStats[question.category] = { total: 0, correct: 0 };
//           }
//           categoryStats[question.category].total++;
//           if (answer.isCorrect) {
//             categoryStats[question.category].correct++;
//           }
//         }
//       });
      
//       // Identify weak areas (categories with < 60% correct)
//       const weakAreas = Object.entries(categoryStats)
//         .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
//         .map(([category]) => category);
      
//       return {
//         averageTimePerQuestion: timeStats.totalTime / this.userAnswers.length,
//         averageTimeCorrect: timeStats.correctCount ? timeStats.correctTime / timeStats.correctCount : 0,
//         averageTimeIncorrect: timeStats.incorrectCount ? timeStats.incorrectTime / timeStats.incorrectCount : 0,
//         categoryPerformance: categoryStats,
//         weakAreas,
//         quizType: this.quizType,
//         difficulty: this.difficulty
//       };
//     }
  
//     shareResults(analyticsManager) {
//       const percentage = Math.round((this.score / this.shuffledQuestions.length) * 100);
//       const shareText = `I scored ${this.score}/${this.shuffledQuestions.length} (${percentage}%) on the HireMeNow ${this.quizType.toUpperCase()} ${this.difficulty} Quiz!`;
      
//       analyticsManager.trackEvent('share_results', { 
//         score: this.score, 
//         percentage,
//         quizType: this.quizType,
//         difficulty: this.difficulty
//       });
      
//       if (navigator.share) {
//         navigator.share({
//           title: 'My HireMeNow Quiz Results',
//           text: shareText,
//           url: window.location.href
//         }).catch(console.error);
//       } else {
//         navigator.clipboard.writeText(shareText)
//           .then(() => {
//             this.uiManager.showToast('Results copied to clipboard!', 'success');
//           })
//           .catch(console.error);
//       }
//     }
  
//     startTimer() {
//       this.timeRemaining = this.timePerQuestion;
//       this.uiManager.updateTimer(this.timeRemaining);
      
//       this.timer = setInterval(() => {
//         this.timeRemaining--;
//         this.uiManager.updateTimer(this.timeRemaining);
        
//         if (this.timeRemaining <= 0) {
//           clearInterval(this.timer);
//           // Auto-submit as time ran out
//           this.handleAnswer(-1); // -1 indicates no answer selected
//         }
//       }, 1000);
//     }
  
//     resetTimer() {
//       clearInterval(this.timer);
//       this.startTimer();
//     }
  
//   saveState() {
//     const state = {
//       currentQuestion: this.currentQuestion,
//       score: this.score,
//       userAnswers: this.userAnswers,
//       shuffledQuestions: this.shuffledQuestions,
//       quizType: this.quizType,
//       difficulty: this.difficulty,
//       timestamp: new Date().getTime()
//     };
    
//     localStorage.setItem('quizState', JSON.stringify(state));
//   }

//   loadSavedState(state) {
//     this.currentQuestion = state.currentQuestion;
//     this.score = state.score;
//     this.userAnswers = state.userAnswers;
//     this.shuffledQuestions = state.shuffledQuestions;
//     this.quizType = state.quizType;
//     this.difficulty = state.difficulty;
    
//     this.uiManager.showQuestionScreen();
//     this.loadQuestion();
//     this.startTimer();
//   }
// }

export class QuizManager {
  constructor(questions, uiManager, quizType = 'js', difficulty = 'easy') {
    this.questions = questions;
    this.uiManager = uiManager;
    this.quizType = quizType;
    this.difficulty = difficulty;
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timer = null;
    this.timeRemaining = null;
    this.timePerQuestion = this.getTimePerDifficulty(difficulty);
    this.shuffledQuestions = [...questions]; // Will be shuffled on start
    this.isPaused = false;
  }

  getTimePerDifficulty(difficulty) {
    switch(difficulty) {
      case 'easy': return 30; // 30 seconds for easy questions
      case 'medium': return 45; // 45 seconds for medium questions
      case 'hard': return 60; // 60 seconds for hard questions
      default: return 30;
    }
  }

  startQuiz() {
    this.shuffleQuestions();
    this.uiManager.showQuestionScreen();
    this.loadQuestion();
    this.startTimer();
    this.saveState();
  }

  restartQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.shuffleQuestions();
    this.uiManager.showQuestionScreen();
    this.loadQuestion();
    this.startTimer();
    this.saveState();
  }

  shuffleQuestions() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledQuestions[i], this.shuffledQuestions[j]] = 
      [this.shuffledQuestions[j], this.shuffledQuestions[i]];
    }
    
    // Limit number of questions based on difficulty
    const maxQuestions = {
      easy: 10,
      medium: 15,
      hard: 20
    };
    
    const limit = maxQuestions[this.difficulty] || 10;
    if (this.shuffledQuestions.length > limit) {
      this.shuffledQuestions = this.shuffledQuestions.slice(0, limit);
    }
  }

  loadQuestion() {
    const question = this.shuffledQuestions[this.currentQuestion];
    const totalQuestions = this.shuffledQuestions.length;
    const progress = (this.currentQuestion / totalQuestions) * 100;
    
    this.uiManager.updateProgress(this.currentQuestion + 1, totalQuestions, progress);
    this.uiManager.setQuestionText(question.question);
    this.uiManager.renderOptions(question.options, (selectedIndex) => 
      this.handleAnswer(selectedIndex)
    );
    
    this.resetTimer();
    this.saveState();
  }

  handleAnswer(selectedIndex) {
    // Stop the timer immediately
    this.stopTimer();
    
    const question = this.shuffledQuestions[this.currentQuestion];
    const correct = selectedIndex === question.correctAnswer;
    
    // Store user's answer for review later
    this.userAnswers.push({
      questionIndex: this.shuffledQuestions[this.currentQuestion].id || this.currentQuestion,
      userAnswer: selectedIndex,
      correctAnswer: question.correctAnswer,
      isCorrect: correct,
      timeSpent: this.timePerQuestion - this.timeRemaining,
      category: question.category || 'general'
    });
    
    this.uiManager.showAnswerFeedback(selectedIndex, question.correctAnswer);
    
    if (question.explanation) {
      this.uiManager.showExplanation(question.explanation);
    }
    
    if (correct) {
      this.score++;
    }
    
    this.saveState();
    
    setTimeout(() => this.moveToNextQuestion(), 2000);
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
    this.uiManager.showResultScreen();
    
    const percentage = Math.round((this.score / this.shuffledQuestions.length) * 100);
    this.uiManager.updateScore(this.score, this.shuffledQuestions.length, percentage);
    
    // Generate detailed performance analysis
    const analysis = this.generatePerformanceAnalysis();
    this.uiManager.showPerformanceAnalysis(analysis);
    
    // Generate review of questions
    this.uiManager.showQuestionReview(this.shuffledQuestions, this.userAnswers);
    
    // Clear saved state as quiz is complete
    localStorage.removeItem('quizState');
  }

  generatePerformanceAnalysis() {
    // Calculate time statistics
    const timeStats = this.userAnswers.reduce((stats, answer) => {
      stats.totalTime += answer.timeSpent;
      if (answer.isCorrect) {
        stats.correctTime += answer.timeSpent;
        stats.correctCount++;
      } else {
        stats.incorrectTime += answer.timeSpent;
        stats.incorrectCount++;
      }
      return stats;
    }, { totalTime: 0, correctTime: 0, incorrectTime: 0, correctCount: 0, incorrectCount: 0 });
    
    // Find categories of questions the user struggled with
    const categoryStats = {};
    this.userAnswers.forEach(answer => {
      const question = this.shuffledQuestions.find((q, index) => 
        index === this.userAnswers.indexOf(answer)
      );
      
      if (question && question.category) {
        if (!categoryStats[question.category]) {
          categoryStats[question.category] = { total: 0, correct: 0 };
        }
        categoryStats[question.category].total++;
        if (answer.isCorrect) {
          categoryStats[question.category].correct++;
        }
      }
    });
    
    // Identify weak areas (categories with < 60% correct)
    const weakAreas = Object.entries(categoryStats)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([category]) => category);
    
    return {
      averageTimePerQuestion: timeStats.totalTime / this.userAnswers.length,
      averageTimeCorrect: timeStats.correctCount ? timeStats.correctTime / timeStats.correctCount : 0,
      averageTimeIncorrect: timeStats.incorrectCount ? timeStats.incorrectTime / timeStats.incorrectCount : 0,
      categoryPerformance: categoryStats,
      weakAreas,
      quizType: this.quizType,
      difficulty: this.difficulty
    };
  }

  shareResults(analyticsManager) {
    const percentage = Math.round((this.score / this.shuffledQuestions.length) * 100);
    const shareText = `I scored ${this.score}/${this.shuffledQuestions.length} (${percentage}%) on the HireMeNow ${this.quizType.toUpperCase()} ${this.difficulty} Quiz!`;
    
    analyticsManager.trackEvent('share_results', { 
      score: this.score, 
      percentage,
      quizType: this.quizType,
      difficulty: this.difficulty
    });
    
    if (navigator.share) {
      navigator.share({
        title: 'My HireMeNow Quiz Results',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          this.uiManager.showToast('Results copied to clipboard!', 'success');
        })
        .catch(console.error);
    }
  }

  startTimer() {
    if (this.timer) {
      this.stopTimer();
    }
    
    this.timeRemaining = this.timeRemaining || this.timePerQuestion;
    this.uiManager.updateTimer(this.timeRemaining);
    
    this.isPaused = false;
    
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.timeRemaining--;
        this.uiManager.updateTimer(this.timeRemaining);
        
        if (this.timeRemaining <= 0) {
          this.stopTimer();
          // Auto-submit as time ran out
          this.handleAnswer(-1); // -1 indicates no answer selected
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  pauseTimer() {
    this.isPaused = true;
  }
  
  resumeTimer() {
    this.isPaused = false;
  }

  resetTimer() {
    this.stopTimer();
    this.timeRemaining = this.timePerQuestion;
    this.startTimer();
  }

  saveState() {
    const state = {
      currentQuestion: this.currentQuestion,
      score: this.score,
      userAnswers: this.userAnswers,
      shuffledQuestions: this.shuffledQuestions,
      quizType: this.quizType,
      difficulty: this.difficulty,
      timeRemaining: this.timeRemaining,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('quizState', JSON.stringify(state));
  }

  loadSavedState(state) {
    this.currentQuestion = state.currentQuestion;
    this.score = state.score;
    this.userAnswers = state.userAnswers;
    this.shuffledQuestions = state.shuffledQuestions;
    this.quizType = state.quizType;
    this.difficulty = state.difficulty;
    this.timeRemaining = state.timeRemaining || this.timePerQuestion;
    
    this.uiManager.showQuestionScreen();
    this.loadQuestion();
    this.startTimer();
  }
}