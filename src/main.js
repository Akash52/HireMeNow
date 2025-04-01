import { QuizManager } from './quizManager.js';
import { UIManager } from './uiManager.js';
import { AnalyticsManager } from './analyticsManager.js';

// Dynamic import of question sets
const questionSets = {
  js: () => import('./questions/javascript.js').then(module => module.questions),
  ts: () => import('./questions/typescript.js').then(module => module.questions),
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  const uiManager = new UIManager();
  const analyticsManager = new AnalyticsManager();
  
  let quizManager = null;
  let selectedQuizType = 'js'; // Default quiz type
  let selectedDifficulty = 'easy'; // Default difficulty
  
  // Set up quiz type selection
  const quizTypeButtons = document.querySelectorAll('.quiz-type-btn');
  quizTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      quizTypeButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      // Update selected quiz type
      selectedQuizType = button.getAttribute('data-type');
      
      analyticsManager.trackEvent('select_quiz_type', { type: selectedQuizType });
    });
  });
  
  // Set up difficulty selection
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      difficultyButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      // Update selected difficulty
      selectedDifficulty = button.getAttribute('data-level');
      
      analyticsManager.trackEvent('select_difficulty', { level: selectedDifficulty });
    });
  });
  
  // Start button click handler
  uiManager.bindStartButton(async () => {
    try {
      uiManager.showLoadingState(true);
      
      // Load questions for selected quiz type
      const allQuestions = await questionSets[selectedQuizType]();
      
      // Filter questions by difficulty
      const filteredQuestions = allQuestions.filter(q => 
        q.difficulty === selectedDifficulty || !q.difficulty
      );
      
      if (filteredQuestions.length === 0) {
        uiManager.showToast('No questions available for this combination. Try another selection.', 'error');
        uiManager.showLoadingState(false);
        return;
      }
      
      // Initialize quiz manager with filtered questions
      quizManager = new QuizManager(filteredQuestions, uiManager, selectedQuizType, selectedDifficulty);
      
      // Start the quiz
      quizManager.startQuiz();
      analyticsManager.trackEvent('start_quiz', { 
        type: selectedQuizType, 
        difficulty: selectedDifficulty,
        questionCount: filteredQuestions.length
      });
      
      uiManager.showLoadingState(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      uiManager.showToast('Failed to load questions. Please try again.', 'error');
      uiManager.showLoadingState(false);
    }
  });
  
  // Restart button click handler
  uiManager.bindRestartButton(() => {
    if (quizManager) {
      quizManager.restartQuiz();
      analyticsManager.trackEvent('restart_quiz', { 
        type: selectedQuizType, 
        difficulty: selectedDifficulty 
      });
    }
  });
  
  // Change topic button click handler
  uiManager.bindChangeTopic(() => {
    uiManager.showStartScreen();
    analyticsManager.trackEvent('change_topic', {});
  });
  
  // Share button click handler
  uiManager.bindShareButton(() => {
    if (quizManager) {
      quizManager.shareResults(analyticsManager);
    }
  });
  
  // Check for saved state
  const savedState = localStorage.getItem('quizState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      if (state.currentQuestion > 0 && state.quizType && state.difficulty) {
        uiManager.showResumePrompt(async () => {
          try {
            uiManager.showLoadingState(true);
            
            // Load questions for saved quiz type
            const allQuestions = await questionSets[state.quizType]();
            
            // Filter questions by saved difficulty
            const filteredQuestions = allQuestions.filter(q => 
              q.difficulty === state.difficulty || !q.difficulty
            );
            
            // Initialize quiz manager with saved state
            quizManager = new QuizManager(
              filteredQuestions, 
              uiManager, 
              state.quizType, 
              state.difficulty
            );
            
            quizManager.loadSavedState(state);
            analyticsManager.trackEvent('resume_quiz', { 
              type: state.quizType, 
              difficulty: state.difficulty 
            });
            
            uiManager.showLoadingState(false);
          } catch (error) {
            console.error('Error resuming quiz:', error);
            uiManager.showToast('Failed to resume quiz. Starting new quiz.', 'error');
            uiManager.showLoadingState(false);
          }
        }, () => {
          localStorage.removeItem('quizState');
          analyticsManager.trackEvent('decline_resume', {});
        });
      }
    } catch (e) {
      console.error('Error parsing saved state:', e);
      localStorage.removeItem('quizState');
    }
  }
  
  // Register service worker for offline capability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('ServiceWorker registered with scope:', registration.scope))
      .catch(error => console.error('ServiceWorker registration failed:', error));
  }
});
