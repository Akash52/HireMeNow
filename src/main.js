import { QuizManager } from './core/QuizManager.js';
import { AnalyticsManager } from './analyticsManager.js';
import UIManager from './uiManager.js';
import InterviewManager from './interview/InterviewManager.js';
import { EbookReader } from './ui/EbookReader.js';
import { EbookManager } from './ui/EbookManager.js';
import { Router } from './router/Router.js';
import { PWAUpdateNotification } from './pwa/UpdateNotification.js';

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
  const analyticsManager = new AnalyticsManager();
  const interviewManager = new InterviewManager(uiManager);
  
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
   */ally
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {red prompt event
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('Service worker registered with scope:', reg.scope);
        
        // Add install prompt handlinger('beforeinstallprompt', (e) => {
        let deferredPrompt;ally showing the prompt
        window.addEventListener('beforeinstallprompt', (e) => {
          // Prevent Chrome 67 and earlier from automatically showing the prompt
          e.preventDefault();
          // Stash the event so it can be triggered later
          deferredPrompt = e;
          
          // Update UI to notify the user they can add to home screenyId('install-button');
          const installButton = document.createElement('button');
          installButton.id = 'install-button';// If the button doesn't exist, create it
          installButton.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg animate-pulse z-50';
          installButton.innerHTML = 'Install App';
          document.body.appendChild(installButton);tall-button';
          'fixed bottom-20 right-4 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg animate-pulse z-50 flex items-center space-x-2';
          installButton.addEventListener('click', async () => {= '<i class="material-icons-round">add_to_home_screen</i><span>Install App</span>';
            // Hide our user interface that shows our install button
            installButton.remove();
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the promptbutton
            const { outcome } = await deferredPrompt.userChoice; installButton.style.display = 'none';
            console.log(`User response to the install prompt: ${outcome}`);   
            // We've used the prompt, and can't use it again, throw it awayhe installation prompt
            deferredPrompt = null;
          });       
        });         // Wait for the user to respond to the prompt
      } catch (error) {           const { outcome } = await deferredPrompt.userChoice;
        console.error('Service worker registration failed:', error);              
      }         // Log the outcome of the user choice
    }l prompt: ${outcome}`);
  }         
and can't use it again, throw it away
  /**= null;
   * Check browser compatibility for required features
   */   // Track installation events if analytics is available
  function checkBrowserCompatibility() {
    // Check for localStoragetrackEvent('pwa_install', { outcome });
    const hasLocalStorage = (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test'); });
        return true;
      } catch (e) {        // Listen for the appinstalled event
        return false;ener('appinstalled', (evt) => {
      }
    })();     console.log('PWA successfully installed');
          
    if (!hasLocalStorage) {alytics is available
      uiManager.showToast('Your browser does not support saving quiz progress.', 'warning');
    }csManager.trackEvent('pwa_installed', { success: true });

    // Check for other essential features
    if (!window.JSON || typeof JSON.parse !== 'function') {  // Remove the install button if it exists
      uiManager.showToast(     const installButton = document.getElementById('install-button');
        'Your browser is outdated and may not work correctly with this application.',       if (installButton) {
        'error'            installButton.remove();
      );     }
    }
  }     // Show a success toast notification if UI manager is available
peof window.uiManager.showToast === 'function') {
  /** use HireMeNow offline.', 'success');
   * Initialize keyboard shortcuts
   */        });
  function initKeyboardShortcuts() {
    // Let the AccessibilityManager in UIManager handle most keyboard shortcutsw appropriate notifications
    // We'll only handle application-specific shortcuts here
          if (window.uiManager && typeof window.uiManager.showToast === 'function') {
    document.addEventListener('keydown', (event) => {You are back online', 'success');
      // Prevent shortcuts when inputs are focused
      if (event.target.matches('input, textarea, select')) return;

      // Shortcut: Alt+R to restart quiz window.addEventListener('offline', () => {
      if (event.key === 'r' && event.altKey && quizManager) {          if (window.uiManager && typeof window.uiManager.showToast === 'function') {
        event.preventDefault();ou are offline. HireMeNow will continue to work.', 'info');
        quizManager.restartQuiz();
      }

      // Shortcut: Alt+S to share results catch (error) {
      if (event.key === 's' && event.altKey && quizManager && quizManager.hasShownResults) { console.error('Service worker registration failed:', error);
        event.preventDefault();   }
        quizManager.shareResults(analyticsManager);    }
      }
    });
  }
atures
  /**
   * Prefetch a specific question set  function checkBrowserCompatibility() {
   */eck for localStorage
  async function prefetchQuestionSet(quizType) {
    if (questionCache.has(quizType)) return;

    try { localStorage.removeItem('test');
      const questions = await questionSets[quizType]();
      if (questions?.length > 0) {
        questionCache.set(quizType, questions);   return false;
      }   }
    } catch (error) {    })();
      logAppError(`Failed to prefetch ${quizType} questions:`, error);
    }
  } uiManager.showToast('Your browser does not support saving quiz progress.', 'warning');

  /**
   * Prefetch question sets for better performance
   */    if (!window.JSON || typeof JSON.parse !== 'function') {
  async function prefetchQuestions() {
    // Immediately prefetch the default quiz typeis outdated and may not work correctly with this application.',
    prefetchQuestionSet(selectedQuizType);

    // Queue other quiz types to be loaded with lower priority
    setTimeout(() => {
      Object.keys(questionSets).forEach((quizType) => {
        if (quizType !== selectedQuizType) {
          prefetchQuestionSet(quizType);* Initialize keyboard shortcuts
        }   */
      });ction initKeyboardShortcuts() {
    }, 2000); // Wait 2 seconds before loading other setsle most keyboard shortcuts
  }/ We'll only handle application-specific shortcuts here

  /**
   * Setup navigation between quiz and interview prep
   */turn;
  function setupNavigation() {
    const navQuizBtn = document.getElementById('nav-quiz');
    const navInterviewBtn = document.getElementById('nav-interview');zManager) {
    const navEbookBtn = document.getElementById('nav-ebook');;
);
    if (navQuizBtn && navInterviewBtn) {
      navQuizBtn.addEventListener('click', () => {
        if (isLoading) return;
        router.navigate('quiz'); event.altKey && quizManager && quizManager.hasShownResults) {
      });
uizManager.shareResults(analyticsManager);
      navInterviewBtn.addEventListener('click', () => {}
        if (isLoading) return;
        router.navigate('interview');
      });
      
      if (navEbookBtn) {ch a specific question set
        navEbookBtn.addEventListener('click', () => {
          if (isLoading) return;nc function prefetchQuestionSet(quizType) {
          router.navigate('ebook'); if (questionCache.has(quizType)) return;
        });
      }ry {
    }ets[quizType]();
  } if (questions?.length > 0) {
 questions);
  /**
   * Set up quiz type selection buttons
   */pe} questions:`, error);
  function setupQuizTypeButtons() {
    const quizTypeButtons = document.querySelectorAll('.quiz-type-btn');  }
    quizTypeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (isLoading) return;   * Prefetch question sets for better performance

        // Remove active class from all buttons
        quizTypeButtons.forEach((btn) => btn.classList.remove('active'));    // Immediately prefetch the default quiz type
Type);
        // Add active class to clicked button
        button.classList.add('active');riority

        // Update selected quiz type
        const newQuizType = button.getAttribute('data-type');        if (quizType !== selectedQuizType) {
        if (newQuizType && questionSets[newQuizType]) {
          selectedQuizType = newQuizType;
          analyticsManager.trackEvent('select_quiz_type', { type: selectedQuizType });
e loading other sets
          // Update route to include the selected quiz type
          if (window.appRouter && window.appRouter.getCurrentRoute().name === 'quiz') {
            window.appRouter.navigate('quiz', { 
              type: selectedQuizType,   * Setup navigation between quiz and interview prep
              difficulty: selectedDifficulty
            });
          }zBtn = document.getElementById('nav-quiz');

          // Prefetch this question set immediately navEbookBtn = document.getElementById('nav-ebook');
          prefetchQuestionSet(selectedQuizType);
        } else {(navQuizBtn && navInterviewBtn) {
          uiManager.showToast('This quiz type is not available yet.', 'warning');   navQuizBtn.addEventListener('click', () => {
        }        if (isLoading) return;
      });   router.navigate('quiz');
    });
  }
r('click', () => {
  /**
   * Set up difficulty selection buttons
   */
  function setupDifficultyButtons() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');      if (navEbookBtn) {
    difficultyButtons.forEach((button) => {) => {
      button.addEventListener('click', () => {
        if (isLoading) return;          router.navigate('ebook');

        // Remove active class from all buttons
        difficultyButtons.forEach((btn) => btn.classList.remove('active'));    }

        // Add active class to clicked button
        button.classList.add('active');

        // Update selected difficulty
        const newDifficulty = button.getAttribute('data-difficulty'); setupQuizTypeButtons() {
        if (newDifficulty) {-type-btn');
          selectedDifficulty = newDifficulty;
          analyticsManager.trackEvent('select_difficulty', { level: selectedDifficulty });
          
          // Update route to include the selected difficulty
          if (window.appRouter && window.appRouter.getCurrentRoute().name === 'quiz') {ve active class from all buttons
            window.appRouter.navigate('quiz', { zTypeButtons.forEach((btn) => btn.classList.remove('active'));
              type: selectedQuizType,
              difficulty: selectedDifficulty/ Add active class to clicked button
            }); button.classList.add('active');
          }
        }        // Update selected quiz type
      });   const newQuizType = button.getAttribute('data-type');
    });pe && questionSets[newQuizType]) {
  }     selectedQuizType = newQuizType;
ckEvent('select_quiz_type', { type: selectedQuizType });
  /**
   * Start a new quiz          // Update route to include the selected quiz type
   */ if (window.appRouter && window.appRouter.getCurrentRoute().name === 'quiz') {
  async function startQuiz() {outer.navigate('quiz', { 
    if (isLoading) return;
              difficulty: selectedDifficulty
    try {
      isLoading = true;
      uiManager.showLoadingState(true);
 set immediately
      // Try to get questions from cache firstSet(selectedQuizType);
      let allQuestions = questionCache.get(selectedQuizType);
rning');
      // If not in cache, load them
      if (!allQuestions) {      });
        if (!questionSets[selectedQuizType]) {
          throw new Error(`Quiz type ${selectedQuizType} not available`);  }
        }

        allQuestions = await questionSets[selectedQuizType]();

        // Store in cache for future useion setupDifficultyButtons() {
        if (allQuestions?.length > 0) {    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
          questionCache.set(selectedQuizType, allQuestions);=> {
        }
      }

      // Filter questions by difficulty        // Remove active class from all buttons
      const filteredQuestions = allQuestions.filter(active'));
        (q) => q.difficulty === selectedDifficulty || !q.difficulty
      );
assList.add('active');
      if (!filteredQuestions || filteredQuestions.length === 0) {
        uiManager.showToast(te selected difficulty
          `No questions available for ${selectedQuizType.toUpperCase()} (${selectedDifficulty}). Try another selection.`, const newDifficulty = button.getAttribute('data-difficulty');
          'error'        if (newDifficulty) {
        );
        return;t('select_difficulty', { level: selectedDifficulty });
      }
e route to include the selected difficulty
      // Initialize quiz manager with filtered questionsouter && window.appRouter.getCurrentRoute().name === 'quiz') {
      quizManager = new QuizManager(er.navigate('quiz', { 
        filteredQuestions,      type: selectedQuizType,
        uiManager,              difficulty: selectedDifficulty
        selectedQuizType,
        selectedDifficulty
      );

      // Start the quiz
      quizManager.startQuiz();
      analyticsManager.trackEvent('start_quiz', {
        type: selectedQuizType,
        difficulty: selectedDifficulty,
        questionCount: filteredQuestions.length,
      });n startQuiz() {
    } catch (error) {
      logAppError('Error starting quiz:', error);
      uiManager.showToast('Failed to load questions. Please try again.', 'error');ry {
    } finally {   isLoading = true;
      uiManager.showLoadingState(false);      uiManager.showLoadingState(true);
      isLoading = false;
    }
  } let allQuestions = questionCache.get(selectedQuizType);

  /**em
   * Bind core action buttons (start, restart, change topic, share)
   */        if (!questionSets[selectedQuizType]) {
  function bindActionButtons() {e ${selectedQuizType} not available`);
    // Start button click handler
    uiManager.bindStartButton(startQuiz);
        allQuestions = await questionSets[selectedQuizType]();
    // Restart button click handler
    uiManager.bindRestartButton(() => {
      if (isLoading || !quizManager) return;h > 0) {
zType, allQuestions);
      quizManager.restartQuiz();
      analyticsManager.trackEvent('restart_quiz', {
        type: selectedQuizType,
        difficulty: selectedDifficulty,
      });estions.filter(
    });=== selectedDifficulty || !q.difficulty
      );
    // Change topic button click handler
    uiManager.bindChangeTopic(() => {th === 0) {
      if (isLoading) return;        uiManager.showToast(
perCase()} (${selectedDifficulty}). Try another selection.`,
      uiManager.showStartScreen();
      analyticsManager.trackEvent('change_topic', {});

      // If a quiz was in progress, confirm before discarding
      if (quizManager && !quizManager.hasShownResults) {
        // Using a safer confirmation approach instead of global confirm/ Initialize quiz manager with filtered questions
        // eslint-disable-next-line no-alert      quizManager = new QuizManager(
        const userConfirmed = window.confirm('Are you sure you want to leave your current quiz?');
        if (!userConfirmed) return;
      }

      // Clear any existing state;
      if (quizManager) {
        quizManager.stopTimer();      // Start the quiz
        quizManager = null;
      } {
    });izType,
electedDifficulty,
    // Share button click handler,
    uiManager.bindShareButton(({ native }) => {
      if (quizManager) {or) {
        if (native) {, error);
          // Use the native share functionalityPlease try again.', 'error');
          quizManager.shareResults(analyticsManager);ally {
        } else {iManager.showLoadingState(false);
          // Use clipboard-based sharingsLoading = false;
          quizManager.shareResults(analyticsManager); }
        }  }
      }
    });
  }Bind core action buttons (start, restart, change topic, share)

  /**ns() {
   * Resume a saved quiz    // Start button click handler
   */ager.bindStartButton(startQuiz);
  async function resumeQuiz(state) {
    if (isLoading) return;
    uiManager.bindRestartButton(() => {
    try {
      isLoading = true;
      uiManager.showLoadingState(true);      quizManager.restartQuiz();
t('restart_quiz', {
      // eslint-disable-next-line no-consolepe: selectedQuizType,
      console.log('Attempting to resume quiz with state:', state);y: selectedDifficulty,

      // Validate required state
      if (
        !state ||ange topic button click handler
        !state.quizType ||
        !state.difficulty ||f (isLoading) return;
        !Array.isArray(state.shuffledQuestions)
      ) {
        throw new Error('Invalid saved state structure');trackEvent('change_topic', {});
      }
nfirm before discarding
      // Load questions for saved quiz type
      let allQuestions;        // Using a safer confirmation approach instead of global confirm
      try {
        // Try to get from cache first= window.confirm('Are you sure you want to leave your current quiz?');
        allQuestions = questionCache.get(state.quizType);

        // If not in cache, load from source
        if (!allQuestions) {ear any existing state
          // Check if quiz type is supported      if (quizManager) {
          if (!questionSets[state.quizType]) {er();
            throw new Error(`Quiz type ${state.quizType} not supported`);
          }      }

          // Load questions
          allQuestions = await questionSets[state.quizType]();
ShareButton(({ native }) => {
          // Cache for future use if valid
          if (Array.isArray(allQuestions) && allQuestions.length > 0) {(native) {
            questionCache.set(state.quizType, allQuestions); // Use the native share functionality
          } else {hareResults(analyticsManager);
            throw new Error('Failed to load questions');
          }
        }   quizManager.shareResults(analyticsManager);
      } catch (error) {        }
        logAppError('Error loading questions:', error);
        throw new Error(`Failed to load questions for ${state.quizType}: ${error.message}`);    });
      }

      // We don't need to filter by difficulty here since we're using the saved questions
   * Resume a saved quiz
      // Update stored selections
      selectedQuizType = state.quizType;
      selectedDifficulty = state.difficulty;

      // Create new QuizManager
      quizManager = new QuizManager(
        allQuestions, // Pass the full question set; we'll use saved shuffled questionsManager.showLoadingState(true);
        uiManager,
        state.quizType,
        state.difficultyle.log('Attempting to resume quiz with state:', state);
      );

      // Don't call these methods if they don't exist
      try {state ||
        // These are optional UI updates - don't block resume if they fail        !state.quizType ||
        if (typeof uiManager.updateQuizTypeSelection === 'function') {
          uiManager.updateQuizTypeSelection(state.quizType);
        }
('Invalid saved state structure');
        if (typeof uiManager.updateDifficultySelection === 'function') {
          uiManager.updateDifficultySelection(state.difficulty);
        }      // Load questions for saved quiz type
      } catch (error) {
        logAppError('Non-critical UI update error:', error);
      }        // Try to get from cache first
stionCache.get(state.quizType);
      // Load the saved state
      const resumeSuccess = quizManager.loadSavedState(state);

      if (resumeSuccess) {ted
        if (analyticsManager) {
          analyticsManager.trackEvent('resume_quiz', {t supported`);
            type: state.quizType,
            difficulty: state.difficulty,
            currentQuestion: state.currentQuestion,          // Load questions
            totalQuestions: state.shuffledQuestions.length,pe]();
          });
        } // Cache for future use if valid
Array.isArray(allQuestions) && allQuestions.length > 0) {
        if (typeof uiManager.showToast === 'function') {tions);
          uiManager.showToast('Quiz resumed successfully', 'success');   } else {
        } Error('Failed to load questions');
      } else {
        throw new Error('Failed to load quiz state');        }
      }
    } catch (error) {;
      logAppError('Error resuming quiz:', error);ssage}`);

      // Show error message
      if (typeof uiManager.showToast === 'function') {ty here since we're using the saved questions
        uiManager.showToast('Could not resume quiz. Starting a new one.', 'error');
      } else {/ Update stored selections
        // Use a safer UI notification method when available, fallback to alert      selectedQuizType = state.quizType;
        // eslint-disable-next-line no-alertdifficulty;
        alert('Could not resume quiz. Starting a new one.');
      }
er = new QuizManager(
      // Start a new quiz insteadtions, // Pass the full question set; we'll use saved shuffled questions
      setTimeout(() => {
        startQuiz(selectedQuizType, selectedDifficulty);
      }, 1000); state.difficulty
    } finally {
      if (typeof uiManager.showLoadingState === 'function') {
        uiManager.showLoadingState(false);   // Don't call these methods if they don't exist
      }      try {
      isLoading = false;   // These are optional UI updates - don't block resume if they fail
    }dateQuizTypeSelection === 'function') {
  }     uiManager.updateQuizTypeSelection(state.quizType);

  /**
   * Check for saved quiz state'function') {
   */icultySelection(state.difficulty);
  async function checkForSavedState() {        }
    try {rror) {
      const savedState = localStorage.getItem('quizState');AppError('Non-critical UI update error:', error);
      if (!savedState) return;

      let state;
      try {avedState(state);
        state = JSON.parse(savedState);
      } catch (e) {f (resumeSuccess) {
        logAppError('Invalid JSON in saved state', e);        if (analyticsManager) {
        localStorage.removeItem('quizState');vent('resume_quiz', {
        return;
      }
rentQuestion: state.currentQuestion,
      // Validate basic structure     totalQuestions: state.shuffledQuestions.length,
      if (!state || !state.quizType || state.currentQuestion === undefined) {          });
        localStorage.removeItem('quizState');
        return;
      }showToast === 'function') {
y', 'success');
      // Check if the state is too old (more than 24 hours)
      const stateTimestamp = state.timestamp || 0;
      const now = Date.now(); throw new Error('Failed to load quiz state');
      if (now - stateTimestamp > 24 * 60 * 60 * 1000) {      }
        localStorage.removeItem('quizState');
        return;ppError('Error resuming quiz:', error);
      }
ge
      // Show resume prompt only if we have a valid in-progress quizshowToast === 'function') {
      if (z. Starting a new one.', 'error');
        state.currentQuestion >= 0 &&
        state.quizType &&/ Use a safer UI notification method when available, fallback to alert
        state.difficulty && no-alert
        Array.isArray(state.shuffledQuestions) &&iz. Starting a new one.');
        state.shuffledQuestions.length > 0
      ) {
        uiManager.showResumePrompt(
          () => resumeQuiz(state),meout(() => {
          () => {artQuiz(selectedQuizType, selectedDifficulty);
            localStorage.removeItem('quizState');, 1000);
            analyticsManager.trackEvent('decline_resume', {});
          }ction') {
        );
      } }
    } catch (e) {   isLoading = false;
      logAppError('Error checking saved state:', e);    }
      localStorage.removeItem('quizState');
    }
  }
tate
  /**
   * Initialize UI components and event bindingsState() {
   */
  function initializeUI() {getItem('quizState');
    // Set up pause/resume functionalityif (!savedState) return;
    uiManager.bindPauseButton(
      () => quizManager?.togglePause(),
      () => quizManager?.togglePause()
    );        state = JSON.parse(savedState);

    // Set up quiz type selectionJSON in saved state', e);
    setupQuizTypeButtons();        localStorage.removeItem('quizState');

    // Set up difficulty selection
    setupDifficultyButtons();

    // Bind core action buttonstate.quizType || state.currentQuestion === undefined) {
    bindActionButtons();        localStorage.removeItem('quizState');

    // Set up navigation between quiz and interview prep
    setupNavigation();
 old (more than 24 hours)
    // Add home logo/brand text navigationmp = state.timestamp || 0;
    setupHomeLogo();  const now = Date.now();
0 * 60 * 1000) {
    // Initialize eBook components
    ebookManager.init();
    
    // Register ebook navigation button
    const ebookNavBtn = document.getElementById('nav-ebook');ve a valid in-progress quiz
    if (ebookNavBtn) {
      ebookNavBtn.addEventListener('click', () => {te.currentQuestion >= 0 &&
        document.querySelectorAll('.nav-btn').forEach(btn => {state.quizType &&
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });state.shuffledQuestions.length > 0
        
        ebookNavBtn.classList.add('active');
        ebookNavBtn.setAttribute('aria-selected', 'true');) => resumeQuiz(state),
          () => {
        document.querySelectorAll('.main-container').forEach(container => {
          container.classList.add('hidden');trackEvent('decline_resume', {});
        });
        ;
        const ebookContainer = document.getElementById('ebook-container');
        if (ebookContainer) { catch (e) {
          ebookContainer.classList.remove('hidden');  logAppError('Error checking saved state:', e);
        }
      });
    }
    
    // Update the existing navigation handlers for quiz and interview to also hide the eBook container
    const navQuizBtn = document.getElementById('nav-quiz');
    const navInterviewBtn = document.getElementById('nav-interview');
    
    if (navQuizBtn) {
      const originalClickHandler = navQuizBtn.onclick;nager.bindPauseButton(
      navQuizBtn.onclick = function(e) { () => quizManager?.togglePause(),
        if (originalClickHandler) originalClickHandler.call(this, e);  () => quizManager?.togglePause()
        document.getElementById('ebook-container')?.classList.add('hidden');
      };
    }
    
    if (navInterviewBtn) {
      const originalClickHandler = navInterviewBtn.onclick;et up difficulty selection
      navInterviewBtn.onclick = function(e) {etupDifficultyButtons();
        if (originalClickHandler) originalClickHandler.call(this, e);
        document.getElementById('ebook-container')?.classList.add('hidden');    // Bind core action buttons
      };indActionButtons();
    }
  }/ Set up navigation between quiz and interview prep

  /**
   * Set up the home logo/brand text to redirect to home page text navigation
   */
  function setupHomeLogo() {
    // Get all elements that should navigate to home page
    const homeElements = [
      document.querySelector('.brand-logo'), // Logo image
      document.querySelector('.brand-text'), // Brand text    // Register ebook navigation button
      document.querySelector('header .logo'), // Header logo container
      document.querySelector('.app-name'), // App name text
    ];dEventListener('click', () => {

    // Add click handler to all home navigation elements (if they exist)
    homeElements.forEach(element => {e');
      if (element) {
        element.style.cursor = 'pointer'; // Make it clear it's clickable
        element.setAttribute('title', 'Go to home page'); // Accessibility hint
        element.addEventListener('click', () => {kNavBtn.setAttribute('aria-selected', 'true');
          // Navigate to home (which is the quiz route by default)
          if (window.appRouter) {ontainer => {
            window.appRouter.navigate('quiz');
            
            // If we were in a quiz and want to go back to selection screen
            if (quizManager && !quizManager.hasShownResults) {ment.getElementById('ebook-container');
              // Ask for confirmation to leave current quiz
              if (confirm('Are you sure you want to leave your current quiz?')) {Container.classList.remove('hidden');
                quizManager.stopTimer();
                quizManager = null;
                uiManager.showStartScreen();
              }
            } else {e the existing navigation handlers for quiz and interview to also hide the eBook container
              // If no active quiz, just show the start screen;
              uiManager.showStartScreen();ew');
            }
            QuizBtn) {
            analyticsManager.trackEvent('navigate_home', { originalClickHandler = navQuizBtn.onclick;
              from_page: window.appRouter.getCurrentRoute().nameavQuizBtn.onclick = function(e) {
            }); if (originalClickHandler) originalClickHandler.call(this, e);
          }     document.getElementById('ebook-container')?.classList.add('hidden');
        });      };
      }
    });
  }    if (navInterviewBtn) {
ndler = navInterviewBtn.onclick;
  // Check for browser compatibilitywBtn.onclick = function(e) {
  checkBrowserCompatibility();        if (originalClickHandler) originalClickHandler.call(this, e);
classList.add('hidden');
  // Initialize UI elements
  initializeUI();    }

  // Try to prefetch question sets in the background
  prefetchQuestions();  /**
 home page
  // Check for saved state immediately
  checkForSavedState();  function setupHomeLogo() {
d navigate to home page
  // Register service worker for offline capability
  registerServiceWorker();      document.querySelector('.brand-logo'), // Logo image

  // Initialize keyboard shortcutsheader .logo'), // Header logo container
  initKeyboardShortcuts();    document.querySelector('.app-name'), // App name text

  // Initialize router (add this before the existing URL parameter checks)
  const router = new Router();e navigation elements (if they exist)
  lement => {
  // Register routes
  router
    .register('quiz', (params) => {ty hint
      // Show quiz section
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');
      const ebookContainer = document.getElementById('ebook-container');      window.appRouter.navigate('quiz');
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');o back to selection screen
      const navEbookBtn = document.getElementById('nav-ebook');
              // Ask for confirmation to leave current quiz
      quizContainer.classList.remove('hidden');ou want to leave your current quiz?')) {
      interviewContainer.classList.add('hidden');
      if (ebookContainer) ebookContainer.classList.add('hidden');
                uiManager.showStartScreen();
      navQuizBtn.classList.add('active');
      navInterviewBtn.classList.remove('active');
      if (navEbookBtn) navEbookBtn.classList.remove('active');
      r.showStartScreen();
      // Handle quiz parameters (type, difficulty)
      if (params.type && questionSets[params.type]) {
        const typeBtn = document.querySelector(`.quiz-type-btn[data-type="${params.type}"]`);navigate_home', {
        if (typeBtn) {rentRoute().name
          document.querySelectorAll('.quiz-type-btn').forEach(btn => btn.classList.remove('active'));   });
          typeBtn.classList.add('active');   }
          selectedQuizType = params.type;  });
          prefetchQuestionSet(selectedQuizType);
        }
      }
      
      if (params.difficulty) {
        const difficultyBtn = document.querySelector(`.difficulty-btn[data-difficulty="${params.difficulty}"]`);
        if (difficultyBtn) {
          document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));itialize UI elements
          difficultyBtn.classList.add('active');ializeUI();
          selectedDifficulty = params.difficulty;
        }tion sets in the background
      }
      
      analyticsManager.trackEvent('view_quiz_section', {k for saved state immediately
        from_route: true,kForSavedState();
        type: params.type || selectedQuizType,
        difficulty: params.difficulty || selectedDifficultyr offline capability
      });
    })
    .register('interview', (params) => {
      // Show interview section
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');ter checks)
      const ebookContainer = document.getElementById('ebook-container');t router = new Router();
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');
      const navEbookBtn = document.getElementById('nav-ebook');
      egister('quiz', (params) => {
      quizContainer.classList.add('hidden');
      interviewContainer.classList.remove('hidden');tById('quiz-container');
      if (ebookContainer) ebookContainer.classList.add('hidden');rview-container');
      const ebookContainer = document.getElementById('ebook-container');
      navQuizBtn.classList.remove('active');
      navInterviewBtn.classList.add('active');ementById('nav-interview');
      if (navEbookBtn) navEbookBtn.classList.remove('active');nt.getElementById('nav-ebook');
      
      // Initialize the interview content if it hasn't been loaded yetuizContainer.classList.remove('hidden');
      if (!interviewManager.isInitialized) {interviewContainer.classList.add('hidden');
        interviewManager.init();lassList.add('hidden');
        interviewManager.isInitialized = true;
      }
      avInterviewBtn.classList.remove('active');
      // Handle specific topic if providedif (navEbookBtn) navEbookBtn.classList.remove('active');
      if (params.topic) {
        interviewManager.selectTopic(params.topic);meters (type, difficulty)
      }ts[params.type]) {
      onst typeBtn = document.querySelector(`.quiz-type-btn[data-type="${params.type}"]`);
      analyticsManager.trackEvent('view_interview_section', {  if (typeBtn) {
        from_route: true,'.quiz-type-btn').forEach(btn => btn.classList.remove('active'));
        topic: params.topic || null);
      });
    })
    .register('ebook', (params) => {
      // Show ebook section if it exists
      const quizContainer = document.getElementById('quiz-container');
      const interviewContainer = document.getElementById('interview-container');
      const ebookContainer = document.getElementById('ebook-container');  const difficultyBtn = document.querySelector(`.difficulty-btn[data-difficulty="${params.difficulty}"]`);
      const navQuizBtn = document.getElementById('nav-quiz');
      const navInterviewBtn = document.getElementById('nav-interview');Each(btn => btn.classList.remove('active'));
      const navEbookBtn = document.getElementById('nav-ebook');t.add('active');
      tedDifficulty = params.difficulty;
      if (!ebookContainer || !navEbookBtn) { }
        // Fallback to quiz section if ebook doesn't exist}
        router.navigate('quiz');
        return;ion', {
      }
        type: params.type || selectedQuizType,
      quizContainer.classList.add('hidden');ectedDifficulty
      interviewContainer.classList.add('hidden');
      ebookContainer.classList.remove('hidden');
      egister('interview', (params) => {
      navQuizBtn.classList.remove('active');
      navInterviewBtn.classList.remove('active');r = document.getElementById('quiz-container');
      navEbookBtn.classList.add('active');etElementById('interview-container');
      onst ebookContainer = document.getElementById('ebook-container');
      // Initialize and load specific book if providedconst navQuizBtn = document.getElementById('nav-quiz');
      if (params.book) {v-interview');
        ebookManager.openBook(params.book); document.getElementById('nav-ebook');
      }
      zContainer.classList.add('hidden');
      analyticsManager.trackEvent('view_ebook_section', {interviewContainer.classList.remove('hidden');
        from_route: true,r) ebookContainer.classList.add('hidden');
        book: params.book || null
      });    navQuizBtn.classList.remove('active');
    })
    .setDefault('quiz')ookBtn.classList.remove('active');
    .init();   
        // Initialize the interview content if it hasn't been loaded yet




});  window.appRouter = router;  // Make router available globally to other modules      if (!interviewManager.isInitialized) {
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
      
      // Initialize and load specific book if provided
      if (params.book) {
        ebookManager.openBook(params.book);
      }
      
      analyticsManager.trackEvent('view_ebook_section', {
        from_route: true,
        book: params.book || null
      });
    })
    .setDefault('quiz')
    .init();
  
  // Make router available globally to other modules
  window.appRouter = router;
});
