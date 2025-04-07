import { CodeExampleManager } from './CodeExampleManager.js';
import { QuestionDatabase } from '../questions/topics/QuestionDatabase';


export default class InterviewManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.codeExampleManager = new CodeExampleManager();
    this.questionDatabase = new QuestionDatabase();

    this.currentTopic = 'js-basics';
    this.bookmarks = JSON.parse(localStorage.getItem('interview-bookmarks') || '[]');
    this.completedItems = JSON.parse(localStorage.getItem('completed-items') || '[]');
    this.initEventListeners();
  }

  initEventListeners() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    topicButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        topicButtons.forEach((btn) => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Load the selected topic
        const topic = button.getAttribute('data-topic');
        this.loadTopic(topic);
      });
    });

    // Initialize search functionality
    document.getElementById('interview-search')?.addEventListener('input', (e) => {
      this.searchQuestions(e.target.value);
    });
  }

  loadTopic(topic) {
    this.currentTopic = topic;
    const contentContainer = document.getElementById('interview-content');

    if (!contentContainer) return;

    // Show loading state
    contentContainer.innerHTML = `
      <div class="flex justify-center items-center py-16">
        <div class="loader">
          <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p class="ml-4 text-lg text-indigo-600 font-medium">Loading content...</p>
      </div>
    `;

    // Load topic content
    this.questionDatabase
      .getTopic(topic)
      .then((topicData) => {
        if (!topicData) {
          contentContainer.innerHTML = `
            <div class="text-center py-16">
              <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No content found</h3>
              <p class="mt-2 text-gray-500">We couldn't find the topic you're looking for.</p>
            </div>
          `;
          return;
        }

        this.renderTopicContent(contentContainer, topicData);
      })
      .catch((error) => {
        console.error('Error loading topic:', error);
        contentContainer.innerHTML = `
          <div class="text-center py-16 text-red-600">
            <svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium">Error loading content</h3>
            <p class="mt-2">Please try again or select another topic.</p>
            <button class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onclick="location.reload()">
              Retry
            </button>
          </div>
        `;
      });
  }

  renderTopicContent(container, topicData) {
    // Count completed items for this topic
    const completedCount = this.completedItems.filter((item) =>
      item.startsWith(`${this.currentTopic}-`)
    ).length;

    // Calculate total questions in this topic
    let totalQuestions = 0;
    topicData.sections.forEach((section) => {
      totalQuestions += section.items.length;
    });

    // Calculate completion percentage
    const completionPercentage =
      totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

    container.innerHTML = `
      <div class="interview-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
        <div>
          <div class="flex items-center">
            <h2 class="text-2xl sm:text-3xl font-bold text-indigo-900">${topicData.title}</h2>
            <span class="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              ${topicData.questionCount || totalQuestions} Questions
            </span>
          </div>
          <p class="mt-2 text-gray-600">${topicData.description}</p>
          
          <div class="mt-4 flex items-center">
            <div class="relative w-48 h-2 bg-gray-200 rounded-full">
              <div class="absolute top-0 left-0 h-full bg-indigo-600 rounded-full" style="width: ${completionPercentage}%"></div>
            </div>
            <span class="ml-3 text-sm font-medium text-indigo-700">${completionPercentage}% Complete</span>
          </div>
        </div>
      </div>
      
      <div id="regular-content" class="space-y-8">
        ${this.renderQuestionSections(topicData.sections)}
      </div>
    `;

    // Initialize syntax highlighting for code blocks
    if (window.hljs) {
      container.querySelectorAll('pre code').forEach((block) => {
        window.hljs.highlightElement(block);
      });
    }

    // Add event listeners for interactive elements
    this.addInteractiveEventListeners(container);

    // Add copy code functionality
    this.addCopyCodeButtons(container);
  }

  renderQuestionSections(sections) {
    if (!sections || !sections.length) return '';

    return sections
      .map(
        (section, sectionIndex) => `
      <div class="interview-section">
        <div class="interview-section-header">
          <h3 class="interview-section-title">
            <i class="fas fa-book-open mr-2"></i> ${section.title}
          </h3>
        </div>
        <div class="interview-section-content">
          ${this.renderSectionItems(section.items, sectionIndex)}
        </div>
      </div>
    `
      )
      .join('');
  }

  renderSectionItems(items, sectionIndex) {
    if (!items || !items.length) return '';

    return items
      .map((item, index) => {
        const itemId = `${this.currentTopic}-${sectionIndex}-${index}`;
        const isCompleted = this.completedItems.includes(itemId);
        const isBookmarked = this.bookmarks.includes(itemId);

        return `
        <div class="interview-item" data-id="${itemId}">
          <div class="interview-item-header flex flex-col sm:flex-row sm:items-start">
            <div class="flex items-start mb-2 sm:mb-0">
              <div class="progress-circle mr-3 ${isCompleted ? 'completed' : ''}">
                ${isCompleted ? '<i class="fas fa-check"></i>' : index + 1}
              </div>
              <h4 class="interview-question pr-8 sm:pr-0">
                ${
                  item.difficulty
                    ? `<span class="category-label ${item.difficulty.toLowerCase()}">${item.difficulty}</span>`
                    : ''
                }
                ${item.question}
              </h4>
            </div>
            <div class="flex items-center mt-2 sm:mt-0 sm:ml-auto">
              <button class="bookmark-btn touch-target-1 ${isBookmarked ? 'active' : ''}" data-id="${itemId}">
                <i class="fas fa-bookmark"></i>
              </button>
              <button class="toggle-answer touch-target-2 ml-3 px-3 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium transition-colors" data-index="${sectionIndex}-${index}">
                <i class="fas fa-chevron-down mr-1"></i> Show Answer
              </button>
            </div>
          </div>
          <div class="answer-content hidden" id="answer-${sectionIndex}-${index}">
            ${this.renderAnswer(item, itemId)}
            
            ${
              item.relatedQuestions
                ? `
              <div class="related-questions mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 class="text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-link mr-1"></i> Related Questions:
                </h5>
                <div class="related-links flex flex-wrap gap-2">
                  ${item.relatedQuestions
                    .map((q) => `<a href="#" class="related-question-link text-sm py-1 px-2 bg-white border border-gray-200 rounded-md">${q}</a>`)
                    .join('')}
                </div>
              </div>
            `
                : ''
            }
            
            <div class="flex justify-end mt-4 pt-3 border-t border-gray-100">
              <button class="mark-complete-btn px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center hover:bg-green-200 transition-colors touch-target-2" data-id="${itemId}">
                <i class="fas fa-${isCompleted ? 'check-circle' : 'circle'} mr-1"></i>
                ${isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  renderAnswer(item, itemId) {
    let answerContent = '';

    // Text answer
    if (item.answer) {
      answerContent += `<div class="text-gray-800 mb-4 leading-relaxed text-base">${item.answer}</div>`;
    }

    // Code example
    if (item.codeExample) {
      answerContent += `
        <div class="code-example relative rounded-lg overflow-hidden" data-language="${item.language || 'javascript'}">
          <div class="code-header bg-gray-800 text-white text-xs py-1.5 px-3 flex justify-between items-center">
            <span>${item.language || 'javascript'}</span>
            <button class="copy-code-btn text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors" data-code="${itemId}">
              <i class="far fa-copy mr-1"></i> Copy
            </button>
          </div>
          <div class="code-content overflow-x-auto">
            <pre class="m-0 p-4"><code class="${item.language || 'javascript'}">${item.codeExample}</code></pre>
          </div>
        </div>
      `;
    }

    // Additional tips
    if (item.tips && item.tips.length) {
      answerContent += `
        <div class="tips mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded">
          <h5 class="font-medium text-yellow-800 mb-2">Pro Tips</h5>
          <ul class="list-disc pl-5 space-y-1">
            ${item.tips.map((tip) => `<li class="text-yellow-700">${tip}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    return answerContent;
  }

  addInteractiveEventListeners(container) {
    // Toggle answer visibility
    const toggleButtons = container.querySelectorAll('.toggle-answer');
    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        const answerContent = document.getElementById(`answer-${index}`);

        if (answerContent.classList.contains('hidden')) {
          // Show answer
          answerContent.classList.remove('hidden');
          answerContent.classList.add('fade-in');
          button.innerHTML = '<i class="fas fa-chevron-up mr-1"></i> Hide Answer';
          button.classList.add('bg-indigo-100');

          // Smooth scroll to make answer visible
          setTimeout(() => {
            answerContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            answerContent.classList.remove('fade-in');
          }, 100);
        } else {
          // Hide answer
          answerContent.classList.add('fade-out');
          button.classList.remove('bg-indigo-100');

          setTimeout(() => {
            answerContent.classList.add('hidden');
            answerContent.classList.remove('fade-out');
            button.innerHTML = '<i class="fas fa-chevron-down mr-1"></i> Show Answer';
          }, 300);
        }
      });
    });

    // Bookmark functionality
    const bookmarkBtns = container.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');

        if (this.bookmarks.includes(itemId)) {
          // Remove bookmark
          this.bookmarks = this.bookmarks.filter((id) => id !== itemId);
          btn.classList.remove('active');
          this.uiManager.showToast('Bookmark removed', 'success');
        } else {
          // Add bookmark
          this.bookmarks.push(itemId);
          btn.classList.add('active');
          this.uiManager.showToast('Bookmark added', 'success');
        }

        localStorage.setItem('interview-bookmarks', JSON.stringify(this.bookmarks));
      });
    });

    // Mark as complete functionality
    const completeBtns = container.querySelectorAll('.mark-complete-btn');
    completeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');
        const progressCircle = container.querySelector(
          `.interview-item[data-id="${itemId}"] .progress-circle`
        );

        if (this.completedItems.includes(itemId)) {
          // Unmark as complete
          this.completedItems = this.completedItems.filter((id) => id !== itemId);
          btn.innerHTML = '<i class="fas fa-circle mr-1"></i> Mark as Complete';

          if (progressCircle) {
            progressCircle.classList.remove('completed');
            progressCircle.innerHTML = itemId.split('-')[2]
              ? (parseInt(itemId.split('-')[2], 10) + 1).toString()
              : '';
          }

          this.uiManager.showToast('Marked as incomplete', 'info');
        } else {
          // Mark as complete
          this.completedItems.push(itemId);
          btn.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Completed';

          if (progressCircle) {
            progressCircle.classList.add('completed');
            progressCircle.innerHTML = '<i class="fas fa-check"></i>';
          }

          this.uiManager.showToast('Marked as complete', 'success');
        }

        localStorage.setItem('completed-items', JSON.stringify(this.completedItems));

        // Update completion percentage
        this.updateCompletionPercentage();
      });
    });
  }

  addCopyCodeButtons(container) {
    const copyButtons = container.querySelectorAll('.copy-code-btn');
    copyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const codeId = button.getAttribute('data-code');
        const codeBlock = container.querySelector(`.code-example[data-code="${codeId}"] code, .code-example code`);

        if (codeBlock) {
          const code = codeBlock.textContent;

          navigator.clipboard
            .writeText(code)
            .then(() => {
              // Change button text temporarily
              const originalHTML = button.innerHTML;
              button.innerHTML = '<i class="fas fa-check"></i> Copied!';
              button.classList.add('bg-green-600', 'text-white');

              setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-600', 'text-white');
              }, 1500);

              this.uiManager.showToast('Code copied to clipboard', 'success');
            })
            .catch((err) => {
              console.error('Could not copy text: ', err);
              this.uiManager.showToast('Failed to copy code', 'error');
            });
        }
      });
    });
  }

  updateCompletionPercentage() {
    // Count completed items for current topic
    const completedCount = this.completedItems.filter((item) =>
      item.startsWith(`${this.currentTopic}-`)
    ).length;

    // Get total questions for this topic
    const topicData = this.questionDatabase.topics[this.currentTopic];
    let totalQuestions = 0;

    if (topicData && topicData.sections) {
      topicData.sections.forEach((section) => {
        totalQuestions += section.items.length;
      });
    }

    // Calculate percentage
    const completionPercentage =
      totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

    // Update the progress bar
    const progressBar = document.querySelector('.interview-header .bg-indigo-600');
    const progressText = document.querySelector('.interview-header .text-indigo-700');

    if (progressBar && progressText) {
      progressBar.style.width = `${completionPercentage}%`;
      progressText.textContent = `${completionPercentage}% Complete`;
    }
  }

  searchQuestions(searchQuery) {
    if (!searchQuery) {
      // Reset search - show all questions
      document.querySelectorAll('.interview-item').forEach((item) => {
        item.style.display = '';
      });
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter questions
    document.querySelectorAll('.interview-item').forEach((item) => {
      const question = item.querySelector('.interview-question').textContent.toLowerCase();

      if (question.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  init() {
    // Load the default topic
    this.loadTopic(this.currentTopic);
  }
}
