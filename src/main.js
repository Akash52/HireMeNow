import { QuizManager } from './core/QuizManager.js';
import { AnalyticsManager } from './analyticsManager.js';
import UIManager from './uiManager.js';
import InterviewManager from './interview/InterviewManager.js';
import { EbookReader } from './ui/EbookReader.js';
import { EbookManager } from './ui/EbookManager.js';
import { Router } from './router/Router.js';
import { PWAUpdateNotification } from './pwa/UpdateNotification.js';
// Import the new tour management components
import { TourManager } from './ui/TourManager.js';
import { HelpButton } from './ui/HelpButton.js';

/**
 * Simple logging function for use before DOM is loaded
 * @param {string} message - Error message
 * @param {Error} error - Error object
 */
function logError(message, error) {
  // eslint-disable-next-line no-console
  console.error(message, error);
}

// Dynamic import of question sets with error handling
const questionSets = {
  js: () =>
    import('./questions/quiz/javascript.js')
      .then((module) => module.questions)
      .catch((error) => {
        logError('Failed to load JavaScript questions:', error);
        return [];
      }),
  ts: () =>
    import('./questions/quiz/typescript.js')
      .then((module) => module.questions)
      .catch((error) => {
        logError('Failed to load TypeScript questions:', error);
        return [];
      }),
};

// Cache question sets for performance
const questionCache = new Map();

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize managers
  const uiManager = new UIManager();
  
  // Make uiManager globally accessible immediately
  window.uiManager = uiManager;

  // Initialize analytics and other managers
  const analyticsManager = new AnalyticsManager();
  const interviewManager = new InterviewManager(uiManager);
  
  // Wait a brief moment to ensure UIManager has fully initialized
  setTimeout(() => {
    // Initialize tour management AFTER UI Manager is ready
    const tourManager = new TourManager(uiManager);
    const helpButton = new HelpButton(tourManager);
    
    // Make tourManager globally accessible
    window.tourManager = tourManager;
    
    // Initialize tour components with simplified versions (no driver.js)
    tourManager.init();
    helpButton.init();
    
    console.log('Tour management initialized with simplified help system');
  }, 100);
  
  // Initialize PWA update notification
  const pwaUpdateManager = new PWAUpdateNotification(uiManager);
  
  // Initialize ebook components
  const ebookReader = new EbookReader(uiManager, uiManager.notificationManager);
  const ebookManager = new EbookManager(uiManager, ebookReader, uiManager.notificationManager);
  
  let quizManager = null;
  let selectedQuizType = 'js'; // Default quiz type
  let selectedDifficulty = 'easy'; // Default difficulty
  let isLoading = false; // Prevent multiple simultaneous operations

  /**
   * Log service worker registration success (abstraction to avoid direct console use)
   * @param {string} scope - The scope of the service worker
   */
  function logRegistrationSuccess(scope) {
    // eslint-disable-next-line no-console
    console.log('ServiceWorker registered with scope:', scope);
  }

  /**
   * Log errors in a controlled way within the DOM loaded scope
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  function logAppError(message, error) {
    // eslint-disable-next-line no-console
    console.error(message, error);
  }

  /**
   * Register service worker for PWA functionality
   */
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        logRegistrationSuccess(reg.scope);
        
        // Add install prompt handler
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
          // Prevent Chrome 67 and earlier from automatically showing the prompt
          e.preventDefault();
          // Stash the event so it can be triggered later
          deferredPrompt = e;
          
          // Update UI to notify the user they can add to home screen
          const installButton = document.createElement('button');
          installButton.id = 'install-button';
          installButton.className = 'fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg animate-pulse z-50 flex items-center space-x-2';
          installButton.innerHTML = '<i class="material-icons-round">add_to_home_screen</i><span>Install App</span>';
          document.body.appendChild(installButton);
          
          installButton.addEventListener('click', async () => {
            // Hide our user interface that shows our install button
            installButton.style.display = 'none';
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
            
            // Track installation events if analytics is available
            if (analyticsManager) {
              analyticsManager.trackEvent('pwa_install', { outcome });
            }
          });
        });
        
        // Listen for the appinstalled event
        window.addEventListener('appinstalled', (evt) => {
          console.log('PWA successfully installed');
          
          // Track installation events if analytics is available
          if (analyticsManager) {
            analyticsManager.trackEvent('pwa_installed', { success: true });
          }
          
          // Remove the install button if it exists
          const installButton = document.getElementById('install-button');
          if (installButton) {
            installButton.remove();
          }
          
          // Show a success toast notification if UI manager is available
          if (uiManager && typeof uiManager.showToast === 'function') {
            uiManager.showToast('You can now use HireMeNow offline.', 'success');
          }
        });
        
        // Show appropriate notifications for online/offline status
        window.addEventListener('online', () => {
          if (uiManager && typeof uiManager.showToast === 'function') {
            uiManager.showToast('You are back online', 'success');
          }
        });
        
        window.addEventListener('offline', () => {
          if (uiManager && typeof uiManager.showToast === 'function') {
            uiManager.showToast('You are offline. HireMeNow will continue to work.', 'info');
          }
        });
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  /**
   * Check browser compatibility for required features
   */
  function checkBrowserCompatibility() {
    // Check for localStorage
    const hasLocalStorage = (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })();
    
    if (!hasLocalStorage) {
      uiManager.showToast('Your browser does not support saving quiz progress.', 'warning');
    }

    // Check for other essential features
    if (!window.JSON || typeof JSON.parse !== 'function') {
      uiManager.showToast(
        'Your browser is outdated and may not work correctly with this application.',
        'error'
      );
    }
  }

  /**
   * Initialize keyboard shortcuts
   */
  function initKeyboardShortcuts() {
    // Let the AccessibilityManager in UIManager handle most keyboard shortcuts
    // We'll only handle application-specific shortcuts here
    document.addEventListener('keydown', (event) => {
      // Prevent shortcuts when inputs are focused
      if (event.target.matches('input, textarea, select')) return;

      // Shortcut: Alt+R to restart quiz
      if (event.key === 'r' && event.altKey && quizManager) {
        event.preventDefault();
        quizManager.restartQuiz();
      }

      // Shortcut: Alt+S to share results
      if (event.key === 's' && event.altKey && quizManager && quizManager.hasShownResults) {
        event.preventDefault();
        quizManager.shareResults(analyticsManager);
      }
    });
  }

  /**
   * Prefetch a specific question set
   */
  async function prefetchQuestionSet(quizType) {
    if (questionCache.has(quizType)) return;

    try {
      const questions = await questionSets[quizType]();
      if (questions?.length > 0) {
        questionCache.set(quizType, questions);
      }
    } catch (error) {
      logAppError(`Failed to prefetch ${quizType} questions:`, error);
    }
  }

  /**
   * Prefetch question sets for better performance
   */
  async function prefetchQuestions() {
    // Immediately prefetch the default quiz type
    prefetchQuestionSet(selectedQuizType);

    // Queue other quiz types to be loaded with lower priority
    setTimeout(() => {
      Object.keys(questionSets).forEach((quizType) => {
        if (quizType !== selectedQuizType) {
          prefetchQuestionSet(quizType);
        }
      });
    }, 2000); // Wait 2 seconds before loading other sets
  }

  /**
   * Setup navigation between quiz and interview prep
   */
  function setupNavigation() {
    const navQuizBtn = document.getElementById('nav-quiz');
    const navInterviewBtn = document.getElementById('nav-interview');
    const navEbookBtn = document.getElementById('nav-ebook');

    if (navQuizBtn && navInterviewBtn) {
      navQuizBtn.addEventListener('click', () => {
        if (isLoading) return;
        // Cleanup any active tours via the UIManager before navigation
        if (uiManager.isTourActive) {
          uiManager.cleanupActiveTour();
        }
        router.navigate('quiz');
      });

      navInterviewBtn.addEventListener('click', () => {
        if (isLoading) return;
        // Cleanup any active tours via the UIManager before navigation
        if (uiManager.isTourActive) {
          uiManager.cleanupActiveTour();
        }
        router.navigate('interview');
      });
      
      if (navEbookBtn) {
        navEbookBtn.addEventListener('click', () => {
          if (isLoading) return;
          // Cleanup any active tours via the UIManager before navigation
          if (uiManager.isTourActive) {
            uiManager.cleanupActiveTour();
          }
          router.navigate('ebook');
        });
      }
    }
  }

  /**
   * Set up quiz type selection buttons
   */
  function setupQuizTypeButtons() {
    const quizTypeButtons = document.querySelectorAll('.quiz-type-btn');
    quizTypeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (isLoading) return;

        // Remove active class from all buttons
        quizTypeButtons.forEach((btn) => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Update selected quiz type
        const newQuizType = button.getAttribute('data-type');
        if (newQuizType && questionSets[newQuizType]) {
          selectedQuizType = newQuizType;
          analyticsManager.trackEvent('select_quiz_type', { type: selectedQuizType });

          // Update route to include the selected quiz type
          if (window.appRouter && window.appRouter.getCurrentRoute().name === 'quiz') {
            window.appRouter.navigate('quiz', { 
              type: selectedQuizType,
              difficulty: selectedDifficulty
            });
          }

          // Prefetch this question set immediately
          prefetchQuestionSet(selectedQuizType);
        } else {
          uiManager.showToast('This quiz type is not available yet.', 'warning');
        }
      });
    });
  }

  /**
   * Set up difficulty selection buttons
   */
  function setupDifficultyButtons() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (isLoading) return;

        // Remove active class from all buttons
        difficultyButtons.forEach((btn) => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Update selected difficulty
        const newDifficulty = button.getAttribute('data-difficulty');
        if (newDifficulty) {
          selectedDifficulty = newDifficulty;
          analyticsManager.trackEvent('select_difficulty', { level: selectedDifficulty });
          
          // Update route to include the selected difficulty
          if (window.appRouter && window.appRouter.getCurrentRoute().name === 'quiz') {
            window.appRouter.navigate('quiz', { 
              type: selectedQuizType,
              difficulty: selectedDifficulty
            });
          }
        }
      });
    });
  }

  /**
   * Start a new quiz
   */
  async function startQuiz() {
    if (isLoading) return;

    try {
      isLoading = true;
      uiManager.showLoadingState(true);

      // Try to get questions from cache first
      let allQuestions = questionCache.get(selectedQuizType);

      // If not in cache, load them
      if (!allQuestions) {
        if (!questionSets[selectedQuizType]) {
          throw new Error(`Quiz type ${selectedQuizType} not available`);
        }

        allQuestions = await questionSets[selectedQuizType]();

        // Store in cache for future use
        if (allQuestions?.length > 0) {
          questionCache.set(selectedQuizType, allQuestions);
        }
      }

      // Filter questions by difficulty
      const filteredQuestions = allQuestions.filter(
        (q) => q.difficulty === selectedDifficulty || !q.difficulty
      );

      if (!filteredQuestions || filteredQuestions.length === 0) {
        uiManager.showToast(
          `No questions available for ${selectedQuizType.toUpperCase()} (${selectedDifficulty}). Try another selection.`,
          'error'
        );
        return;
      }

      // Initialize quiz manager with filtered questions
      quizManager = new QuizManager(
        filteredQuestions,
        uiManager,
        selectedQuizType,
        selectedDifficulty
      );

      // Start the quiz
      quizManager.startQuiz();
      analyticsManager.trackEvent('start_quiz', {
        type: selectedQuizType,
        difficulty: selectedDifficulty,
        questionCount: filteredQuestions.length,
      });
    } catch (error) {
      logAppError('Error starting quiz:', error);
      uiManager.showToast('Failed to load questions. Please try again.', 'error');
    } finally {
      uiManager.showLoadingState(false);
      isLoading = false;
    }
  }

  /**
   * Bind core action buttons (start, restart, change topic, share)
   */
  function bindActionButtons() {
    // Start button click handler
    uiManager.bindStartButton(startQuiz);

    // Restart button click handler
    uiManager.bindRestartButton(() => {
      if (isLoading || !quizManager) return;
      quizManager.restartQuiz();
      analyticsManager.trackEvent('restart_quiz', {
        type: selectedQuizType,
        difficulty: selectedDifficulty,
      });
    });

    // Change topic button click handler
    uiManager.bindChangeTopic(() => {
      if (isLoading) return;
      uiManager.showStartScreen();
      analyticsManager.trackEvent('change_topic', {});

      // If a quiz was in progress, confirm before discarding
      if (quizManager && !quizManager.hasShownResults) {
        // Using a safer confirmation approach instead of global confirm
        // eslint-disable-next-line no-alert
        const userConfirmed = window.confirm('Are you sure you want to leave your current quiz?');
        if (!userConfirmed) return;
      }

      // Clear any existing state
      if (quizManager) {
        quizManager.stopTimer();
        quizManager = null;
      }
    });

    // Share button click handler
    uiManager.bindShareButton(({ native }) => {
      if (quizManager) {
        if (native) {
          // Use the native share functionality
          quizManager.shareResults(analyticsManager);
        } else {
          // Use clipboard-based sharing
          quizManager.shareResults(analyticsManager);
        }
      }
    });
  }

  /**
   * Resume a saved quiz
   */
  async function resumeQuiz(state) {
    if (isLoading) return;

    try {
      isLoading = true;
      uiManager.showLoadingState(true);

      // eslint-disable-next-line no-console
      console.log('Attempting to resume quiz with state:', state);

      // Validate required state
      if (
        !state ||
        !state.quizType ||
        !state.difficulty ||
        !Array.isArray(state.shuffledQuestions)
      ) {
        throw new Error('Invalid saved state structure');
      }

      // Load questions for saved quiz type
      let allQuestions;
      try {
        // Try to get from cache first
        allQuestions = questionCache.get(state.quizType);

        // If not in cache, load from source
        if (!allQuestions) {
          // Check if quiz type is supported
          if (!questionSets[state.quizType]) {
            throw new Error(`Quiz type ${state.quizType} not supported`);
          }

          // Load questions
          allQuestions = await questionSets[state.quizType]();

          // Cache for future use if valid
          if (Array.isArray(allQuestions) && allQuestions.length > 0) {
            questionCache.set(state.quizType, allQuestions);
          } else {
            throw new Error('Failed to load questions');
          }
        }
      } catch (error) {
        logAppError('Error loading questions:', error);
        throw new Error(`Failed to load questions for ${state.quizType}: ${error.message}`);
      }

      // We don't need to filter by difficulty here since we're using the saved questions

      // Update stored selections
      selectedQuizType = state.quizType;
      selectedDifficulty = state.difficulty;

      // Create new QuizManager
      quizManager = new QuizManager(
        allQuestions, // Pass the full question set; we'll use saved shuffled questions
        uiManager,
        state.quizType,
        state.difficulty
      );

      // Don't call these methods if they don't exist
      try {
        // These are optional UI updates - don't block resume if they fail
        if (typeof uiManager.updateQuizTypeSelection === 'function') {
          uiManager.updateQuizTypeSelection(state.quizType);
        }

        if (typeof uiManager.updateDifficultySelection === 'function') {
          uiManager.updateDifficultySelection(state.difficulty);
        }
      } catch (error) {
        logAppError('Non-critical UI update error:', error);
      }

      // Load the saved state
      const resumeSuccess = quizManager.loadSavedState(state);

      if (resumeSuccess) {
        if (analyticsManager) {
          analyticsManager.trackEvent('resume_quiz', {
            type: state.quizType,
            difficulty: state.difficulty,
            currentQuestion: state.currentQuestion,
            totalQuestions: state.shuffledQuestions.length,
          });
        }

        if (typeof uiManager.showToast === 'function') {
          uiManager.showToast('Quiz resumed successfully', 'success');
        }
      } else {
        throw new Error('Failed to load quiz state');
      }
    } catch (error) {
      logAppError('Error resuming quiz:', error);

      // Show error message
      if (typeof uiManager.showToast === 'function') {
        uiManager.showToast('Could not resume quiz. Starting a new one.', 'error');
      } else {
        // Use a safer UI notification method when available, fallback to alert
        // eslint-disable-next-line no-alert
        alert('Could not resume quiz. Starting a new one.');
      }

      // Start a new quiz instead
      setTimeout(() => {
        startQuiz(selectedQuizType, selectedDifficulty);
      }, 1000);
    } finally {
      if (typeof uiManager.showLoadingState === 'function') {
        uiManager.showLoadingState(false);
      }
      isLoading = false;
    }
  }

  /**
   * Check for saved quiz state
   */
  async function checkForSavedState() {
    try {
      const savedState = localStorage.getItem('quizState');
      if (!savedState) return;

      let state;
      try {
        state = JSON.parse(savedState);
      } catch (e) {
        logAppError('Invalid JSON in saved state', e);
        localStorage.removeItem('quizState');
        return;
      }

      // Validate basic structure
      if (!state || !state.quizType || state.currentQuestion === undefined) {
        localStorage.removeItem('quizState');
        return;
      }

      // Check if the state is too old (more than 24 hours)
      const stateTimestamp = state.timestamp || 0;
      const now = Date.now();
      if (now - stateTimestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('quizState');
        return;
      }

      // Show resume prompt only if we have a valid in-progress quiz
      if (
        state.currentQuestion >= 0 &&
        state.quizType &&
        state.difficulty &&
        Array.isArray(state.shuffledQuestions) &&
        state.shuffledQuestions.length > 0
      ) {
        uiManager.showResumePrompt(
          () => resumeQuiz(state),
          () => {
            localStorage.removeItem('quizState');
            analyticsManager.trackEvent('decline_resume', {});
          }
        );
      }
    } catch (e) {
      logAppError('Error checking saved state:', e);
      localStorage.removeItem('quizState');
    }
  }

  /**
   * Initialize UI components and event bindings
   */
  function initializeUI() {
    // Set up pause/resume functionality
    uiManager.bindPauseButton(
      () => quizManager?.togglePause(),
      () => quizManager?.togglePause()
    );

    // Set up quiz type selection
    setupQuizTypeButtons();

    // Set up difficulty selection
    setupDifficultyButtons();

    // Bind core action buttons
    bindActionButtons();

    // Set up navigation between quiz and interview prep
    setupNavigation();

    // Add home logo/brand text navigation
    setupHomeLogo();

    // Initialize eBook components
    ebookManager.init();
    
    // Register ebook navigation button
    const ebookNavBtn = document.getElementById('nav-ebook');
    if (ebookNavBtn) {
      ebookNavBtn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        
        ebookNavBtn.classList.add('active');
        ebookNavBtn.setAttribute('aria-selected', 'true');
        
        document.querySelectorAll('.main-container').forEach(container => {
          container.classList.add('hidden');
        });
        
        const ebookContainer = document.getElementById('ebook-container');
        if (ebookContainer) {
          ebookContainer.classList.remove('hidden');
        }
      });
    }
    
    // Update the existing navigation handlers for quiz and interview to also hide the eBook container
    const navQuizBtn = document.getElementById('nav-quiz');
    const navInterviewBtn = document.getElementById('nav-interview');
    
    if (navQuizBtn) {
      const originalClickHandler = navQuizBtn.onclick;
      navQuizBtn.onclick = function(e) {
        if (originalClickHandler) originalClickHandler.call(this, e);
        document.getElementById('ebook-container')?.classList.add('hidden');
      };
    }
    
    if (navInterviewBtn) {
      const originalClickHandler = navInterviewBtn.onclick;
      navInterviewBtn.onclick = function(e) {
        if (originalClickHandler) originalClickHandler.call(this, e);
        document.getElementById('ebook-container')?.classList.add('hidden');
      };
    }
  }

  /**
   * Set up the home logo/brand text to redirect to home page
   */
  function setupHomeLogo() {
    // Get all elements that should navigate to home page
    const homeElements = [
      document.querySelector('.brand-logo'), // Logo image
      document.querySelector('.brand-text'), // Brand text
      document.querySelector('header .logo'), // Header logo container
      document.querySelector('.app-name'), // App name text
    ];

    // Add click handler to all home navigation elements (if they exist)
    homeElements.forEach(element => {
      if (element) {
        element.style.cursor = 'pointer'; // Make it clear it's clickable
        element.setAttribute('title', 'Go to home page'); // Accessibility hint
        element.addEventListener('click', () => {
          // Navigate to home (which is the quiz route by default)
          if (window.appRouter) {
            window.appRouter.navigate('quiz');
            
            // If we were in a quiz and want to go back to selection screen
            if (quizManager && !quizManager.hasShownResults) {
              // Ask for confirmation to leave current quiz
              if (confirm('Are you sure you want to leave your current quiz?')) {
                quizManager.stopTimer();
                quizManager = null;
                uiManager.showStartScreen();
              }
            } else {
              // If no active quiz, just show the start screen
              uiManager.showStartScreen();
            }

            analyticsManager.trackEvent('navigate_home', {
              from_page: window.appRouter.getCurrentRoute().name
            });
          }
        });
      }
    });
  }

  // Check for browser compatibility
  checkBrowserCompatibility();

  // Initialize UI elements
  initializeUI();

  // Try to prefetch question sets in the background
  prefetchQuestions();

  // Check for saved state immediately
  checkForSavedState();

  // Register service worker for offline capability
  registerServiceWorker();

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();

  // Initialize router (add this before the existing URL parameter checks)
  const router = new Router();
  // Make router globally accessible right away
  window.appRouter = router;

  // Register routes
  router
    .register('quiz', (params) => {
      // Show quiz section
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');
      const ebookContainer = document.getElementById('ebook-container');
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');
      const navEbookBtn = document.getElementById('nav-ebook');
      
      quizContainer.classList.remove('hidden');
      interviewContainer.classList.add('hidden');
      if (ebookContainer) ebookContainer.classList.add('hidden');
      
      navQuizBtn.classList.add('active');
      navInterviewBtn.classList.remove('active');
      if (navEbookBtn) navEbookBtn.classList.remove('active');
      
      // Handle quiz parameters (type, difficulty)
      if (params.type && questionSets[params.type]) {
        const typeBtn = document.querySelector(`.quiz-type-btn[data-type="${params.type}"]`);
        if (typeBtn) {
          document.querySelectorAll('.quiz-type-btn').forEach(btn => btn.classList.remove('active'));
          typeBtn.classList.add('active');
          selectedQuizType = params.type;
          prefetchQuestionSet(selectedQuizType);
        }
      }
      
      if (params.difficulty) {
        const difficultyBtn = document.querySelector(`.difficulty-btn[data-difficulty="${params.difficulty}"]`);
        if (difficultyBtn) {
          document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
          difficultyBtn.classList.add('active');
          selectedDifficulty = params.difficulty;
        }
      }
      
      analyticsManager.trackEvent('view_quiz_section', {
        from_route: true,
        type: params.type || selectedQuizType,
        difficulty: params.difficulty || selectedDifficulty
      });
      
      // Start a tour for this section if coming from another section
      if (uiManager.lastRoute && uiManager.lastRoute !== 'quiz' && uiManager.isTourActive) {
        setTimeout(() => uiManager.startQuizFeatureTour(), 500);
      }
      
      // Remember current route
      uiManager.lastRoute = 'quiz';
    })
    .register('interview', (params) => {
      // Show interview section
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');
      const ebookContainer = document.getElementById('ebook-container');
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');
      const navEbookBtn = document.getElementById('nav-ebook');
      
      quizContainer.classList.add('hidden');
      interviewContainer.classList.remove('hidden');
      if (ebookContainer) ebookContainer.classList.add('hidden');
      
      navQuizBtn.classList.remove('active');
      navInterviewBtn.classList.add('active');
      if (navEbookBtn) navEbookBtn.classList.remove('active');
      
      // Initialize the interview content if it hasn't been loaded yet
      if (!interviewManager.isInitialized) {
        interviewManager.init();
        interviewManager.isInitialized = true;
      }
      
      // Handle specific topic if provided
      if (params.topic) {
        interviewManager.selectTopic(params.topic);
      }
      
      analyticsManager.trackEvent('view_interview_section', {
        from_route: true,
        topic: params.topic || null
      });
      
      // Start a tour for this section if coming from another section
      if (uiManager.lastRoute && uiManager.lastRoute !== 'interview' && uiManager.isTourActive) {
        setTimeout(() => uiManager.startInterviewFeatureTour(), 500);
      }
      
      // Remember current route
      uiManager.lastRoute = 'interview';
    })
    .register('ebook', (params) => {
      // Show ebook section if it exists
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');
      const ebookContainer = document.getElementById('ebook-container');
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');
      const navEbookBtn = document.getElementById('nav-ebook');
      
      if (!ebookContainer || !navEbookBtn) {
        // Fallback to quiz section if ebook doesn't exist
        router.navigate('quiz');
        return;
      }
      
      quizContainer.classList.add('hidden');
      interviewContainer.classList.add('hidden');
      ebookContainer.classList.remove('hidden');
      
      navQuizBtn.classList.remove('active');
      navInterviewBtn.classList.remove('active');
      navEbookBtn.classList.add('active');
      
      // Ensure ebook visibility with fallback function
      import('./ui/EbookFallback.js').then(module => {
        setTimeout(() => {
          module.ensureEbookVisibility();
        }, 500);
      }).catch(err => {
        console.error('Failed to load ebook fallback:', err);
      });
      
      // Show correct tab based on if a book is specified
      if (params.book) {
        // Switch to reader tab when a book is specified
        const readerTab = document.getElementById('ebook-tab');
        if (readerTab) {
          readerTab.click();
        }
        
        // Try to open the book
        if (window.ebookManager) {
          ebookManager.openBook(params.book);
        }
      } else {
        // Switch to library tab when no book is specified
        const libraryTab = document.getElementById('ebook-library-tab');
        if (libraryTab) {
          libraryTab.click();
        }
      }
      
      analyticsManager.trackEvent('view_ebook_section', {
        from_route: true,
        book: params.book || null
      });
      
      // Start a tour for this section if coming from another section
      if (uiManager.lastRoute && uiManager.lastRoute !== 'ebook' && uiManager.isTourActive) {
        setTimeout(() => uiManager.startEbookFeatureTour(), 500);
      }
      
      // Remember current route
      uiManager.lastRoute = 'ebook';
    })
    .setDefault('quiz')
    .init();
  
  // Make router available globally to other modules
  window.appRouter = router;
});
