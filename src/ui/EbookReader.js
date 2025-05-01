/**
 * EbookReader handles displaying and navigating through ebook content
 */
export class EbookReader {
  constructor(uiManager, notificationManager) {
    this.uiManager = uiManager;
    this.notificationManager = notificationManager;
    this.currentBook = null;
    this.currentChapter = 0;
    this.bookmarks = this.loadBookmarks();
    this.highlights = this.loadHighlights();
    this.fontSize = localStorage.getItem('ebookFontSize') || 'medium';
    this.lastScrollPosition = {};
    this.theme = localStorage.getItem('ebookTheme') || 'default';
    this.availableThemes = {
      default: {
        name: 'Default',
        bgColor: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'indigo'
      },
      sepia: {
        name: 'Sepia',
        bgColor: 'bg-amber-50',
        textColor: 'text-yellow-900',
        accentColor: 'amber'
      },
      night: {
        name: 'Night',
        bgColor: 'bg-gray-900',
        textColor: 'text-gray-100',
        accentColor: 'gray'
      },
      forest: {
        name: 'Forest',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        accentColor: 'green'
      },
      ocean: {
        name: 'Ocean',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900',
        accentColor: 'blue'
      }
    };
    this.isLoading = false; // Add loading state tracker
  }

  /**
   * Initialize the eBook reader and bind events
   */
  init() {
    this.bindEvents();
    this.applyFontSize();
    
    // Make sure we have the applyTheme method implemented
    if (typeof this.applyTheme === 'function') {
      this.applyTheme();
    }
  }

  /**
   * Load an eBook by its ID
   * @param {string} bookId - ID of the book to load
   */
  async loadBook(bookId, useFallback = false) {
    // Prevent duplicate loading
    if (this.isLoading) {
      return false;
    }
    
    // If the same book is already loaded, just return true
    if (this.currentBook && this.currentBook.id === bookId) {
      return true;
    }
    
    this.isLoading = true;
    
    try {
      // Currently we only support JSEbook
      if (bookId === 'js-prototypes') {
        try {
          if (useFallback) {
            throw new Error('Using fallback content directly');
          }
          
          // Try remote URL first
          const response = await fetch('https://raw.githubusercontent.com/Akash52/HireMeNow/main/src/questions/ebook/JSEbook.md');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch book content: ${response.status}`);
          }
          
          const content = await response.text();
          this.currentBook = {
            id: bookId,
            title: 'JavaScript Prototypes and Inheritance',
            content: content
          };
        } catch (error) {
          console.error('Error fetching from remote URL, using fallback content', error);
          
          // Use fallback content if remote fetch fails
          this.currentBook = {
            id: bookId,
            title: 'JavaScript Prototypes and Inheritance',
            content: this.getFallbackBookContent()
          };
        }
        
        this.displayBook();
        this.notificationManager.showToast('eBook loaded successfully', 'success');
        this.isLoading = false;
        return true;
      } else {
        throw new Error('Book not found');
      }
    } catch (error) {
      console.error('Error loading book:', error);
      this.notificationManager.showToast('Failed to load eBook', 'error');
      this.isLoading = false;
      return false;
    }
  }
  
  /**
   * Provides fallback content when remote loading fails
   * @returns {string} Markdown content
   */
  getFallbackBookContent() {
    return `# JavaScript Prototypes and Inheritance

## Introduction to JavaScript Prototypes

JavaScript is a prototype-based language, which means that objects inherit properties and methods from prototype objects. This is a different approach compared to class-based languages.

### What is a Prototype?

In JavaScript, every object has a prototype property, which is a reference to another object. When a property is accessed on an object and if the property is not found on that object, JavaScript looks at the object's prototype, and if not found there, it looks at the prototype's prototype, and so on until it either finds the property or reaches an object with a null prototype.

\`\`\`javascript stackblitz
// Creating an object
const person = {
  name: 'John',
  age: 30,
  greet() {
    return \`Hello, my name is \${this.name}\`;
  }
};

// person.__proto__ is the prototype of the person object
console.log(person.__proto__ === Object.prototype); // true

// Try running this code!
const element = document.createElement('div');
element.textContent = person.greet();
document.body.appendChild(element);
\`\`\`

## Prototypal Inheritance

Inheritance in JavaScript is achieved through the prototype chain. A prototype chain is a series of linked objects that allows objects to inherit properties and methods from other objects.

### How Prototypal Inheritance Works

When you try to access a property of an object, JavaScript first looks at the object itself. If it can't find the property there, it looks at the object's prototype, and so on up the prototype chain.

\`\`\`javascript stackblitz
// Parent constructor function
function Animal(name) {
  this.name = name;
}

// Adding a method to Animal's prototype
Animal.prototype.speak = function() {
  return \`\${this.name} makes a noise.\`;
};

// Child constructor function
function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override speak method
Dog.prototype.speak = function() {
  return \`\${this.name} barks.\`;
};

// Create instances
const animal = new Animal('Generic Animal');
const dog = new Dog('Rex', 'German Shepherd');

console.log(animal.speak()); // "Generic Animal makes a noise."
console.log(dog.speak());    // "Rex barks."
console.log(dog.breed);      // "German Shepherd"

// Display results on page
const output = document.createElement('div');
output.innerHTML = \`
  <p>\${animal.speak()}</p>
  <p>\${dog.speak()}</p>
  <p>Breed: \${dog.breed}</p>
\`;
document.body.appendChild(output);
\`\`\`

## The Prototype Chain

The prototype chain is the mechanism that allows objects to inherit properties and methods from their prototypes. When a property is accessed on an object, JavaScript looks up the prototype chain until it finds the property or reaches the end of the chain.

### Visualizing the Prototype Chain

\`\`\`javascript
// Create objects with prototypal inheritance
const grandparent = { lastName: 'Smith' };
const parent = Object.create(grandparent);
parent.firstName = 'John';
const child = Object.create(parent);
child.name = 'Chris';

// Accessing properties up the prototype chain
console.log(child.name);        // "Chris" - own property
console.log(child.firstName);   // "John" - from parent
console.log(child.lastName);    // "Smith" - from grandparent
\`\`\`

## ES6 Classes and Prototypal Inheritance

ES6 introduced class syntax to JavaScript, but it's important to understand that this is primarily syntactic sugar over JavaScript's existing prototype-based inheritance.

### Classes vs Prototypes

\`\`\`javascript stackblitz
// ES6 Class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return \`\${this.name} makes a noise.\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    return \`\${this.name} barks.\`;
  }
}

// The above is equivalent to the prototype example earlier
// Create instances
const animal = new Animal('Generic Animal');
const dog = new Dog('Rex', 'German Shepherd');

// Display results
const results = document.createElement('div');
results.innerHTML = \`
  <h3>Class-based examples:</h3>
  <p>\${animal.speak()}</p>
  <p>\${dog.speak()}</p>
  <p>Dog breed: \${dog.breed}</p>
\`;
document.body.appendChild(results);
\`\`\`

## Performance Considerations

Understanding the performance implications of prototypal inheritance is crucial for writing efficient JavaScript code.

### Prototype Chain Lookup

The longer the prototype chain, the more time it takes to look up properties, which can impact performance in performance-critical applications.

\`\`\`javascript
// Shallow prototype chain (faster lookups)
const directObj = { prop: 'value' };
console.log(directObj.prop); // Direct access

// Deep prototype chain (slower lookups)
const obj1 = {};
const obj2 = Object.create(obj1);
const obj3 = Object.create(obj2);
const obj4 = Object.create(obj3);
obj1.deepProp = 'deep value';
console.log(obj4.deepProp); // Must traverse the chain
\`\`\`

## Best Practices

Here are some best practices when working with prototypes and inheritance in JavaScript:

1. **Keep the prototype chain short**: Minimize the depth of your prototype chains to improve performance.
2. **Use composition over inheritance**: In many cases, composition can be more flexible than inheritance.
3. **Understand the difference between prototype and instance properties**: Properties that should be shared go on the prototype; unique properties go on the instance.

\`\`\`javascript
// Bad: Adding methods to the instance
function BadExample() {
  this.method = function() {
    // This creates a new function for each instance
  };
}

// Good: Adding methods to the prototype
function GoodExample() {}
GoodExample.prototype.method = function() {
  // This shares one function across all instances
};
\`\`\`

## Summary

JavaScript's prototypal inheritance system is powerful and flexible. By understanding how prototypes work, you can write more efficient and effective JavaScript code. Whether you use the older prototype syntax or the newer class syntax, the underlying mechanics remain the same.

Remember that JavaScript's prototype system is different from classical inheritance found in languages like Java or C++. Embracing this difference and understanding how it works can lead to better code organization and structure in your JavaScript applications.`;
  }

  /**
   * Display the current book in the reader
   */
  displayBook() {
    if (!this.currentBook) return;
    
    // Get container elements
    const container = document.getElementById('ebook-container');
    const contentArea = document.getElementById('ebook-content');
    const tocArea = document.getElementById('ebook-toc');
    
    if (!container || !contentArea || !tocArea) return;
    
    // Make the container visible
    container.classList.remove('hidden');
    
    // Set the title
    document.getElementById('ebook-title').textContent = this.currentBook.title;
    
    // Process content and extract TOC
    const { content, toc } = this.processContent(this.currentBook.content);
    
    // Display content with proper rendering
    contentArea.innerHTML = content;
    
    // Generate and display table of contents with Vite-style
    this.renderTableOfContents(toc, tocArea);
    
    // Apply syntax highlighting to code blocks
    this.applySyntaxHighlighting();
    
    // Initialize clipboard for code blocks
    this.initializeClipboard();
    
    // Add reading controls
    this.addReadingControls();
    
    // Apply saved bookmarks and highlights
    this.applyBookmarks();
    this.applyHighlights();
    
    // Apply current theme if the method exists
    try {
      if (typeof this.applyTheme === 'function') {
        this.applyTheme();
      }
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
    
    // Apply font size
    this.applyFontSize();
    
    // Restore scroll position if available
    this.restoreScrollPosition();
    
    // Update progress indicator
    this.updateProgressIndicator();
    
    // Add back button functionality
    const backButton = document.getElementById('ebook-back-btn');
    if (backButton) {
      backButton.addEventListener('click', () => {
        // Show library view
        const libraryTab = document.getElementById('ebook-library-tab');
        if (libraryTab) {
          libraryTab.click();
        }
      });
    }
    
    // Setup mobile TOC toggle
    const mobileTocToggle = document.getElementById('mobile-toc-toggle');
    if (mobileTocToggle) {
      mobileTocToggle.addEventListener('click', () => {
        this.toggleMobileToc();
      });
    }
  }

  /**
   * Toggle mobile TOC visibility
   */
  toggleMobileToc() {
    // Create a mobile TOC overlay if it doesn't exist
    let mobileToc = document.getElementById('mobile-toc-overlay');
    
    if (mobileToc) {
      // If it exists, toggle visibility
      mobileToc.classList.toggle('hidden');
      return;
    }
    
    // Create mobile TOC overlay
    mobileToc = document.createElement('div');
    mobileToc.id = 'mobile-toc-overlay';
    mobileToc.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex md:hidden';
    
    const tocContent = document.createElement('div');
    tocContent.className = 'w-3/4 max-w-xs h-full bg-white overflow-y-auto animate-slide-in-right';
    
    // Clone TOC content
    const originalToc = document.getElementById('ebook-toc');
    if (originalToc) {
      tocContent.innerHTML = `
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-indigo-900">Table of Contents</h3>
          <button id="close-mobile-toc" class="text-gray-500 hover:text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          ${originalToc.innerHTML}
        </div>
      `;
    }
    
    mobileToc.appendChild(tocContent);
    document.body.appendChild(mobileToc);
    
    // Add close functionality
    const closeBtn = document.getElementById('close-mobile-toc');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileToc.classList.add('hidden');
      });
    }
    
    // Close when clicking outside
    mobileToc.addEventListener('click', (e) => {
      if (e.target === mobileToc) {
        mobileToc.classList.add('hidden');
      }
    });
    
    // Make TOC links work
    tocContent.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToc.classList.add('hidden');
      });
    });
  }

  /**
   * Update reading progress indicator
   */
  updateProgressIndicator() {
    const contentArea = document.getElementById('ebook-content');
    const indicator = document.getElementById('reading-progress-indicator');
    
    if (!contentArea || !indicator) return;
    
    // Initial progress update
    const updateProgress = () => {
      const scrollTop = contentArea.scrollTop;
      const scrollHeight = contentArea.scrollHeight;
      const clientHeight = contentArea.clientHeight;
      
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      indicator.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    };
    
    // Update initially
    updateProgress();
    
    // Update on scroll
    contentArea.addEventListener('scroll', updateProgress);
  }

  /**
   * Render table of contents with Vite-style
   * @param {Array} toc - Table of contents data
   * @param {HTMLElement} container - Container element
   */
  renderTableOfContents(toc, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create HTML for TOC with improved styling
    const renderItems = (items, level = 0) => {
      const list = document.createElement('ul');
      list.className = level === 0 ? 'space-y-1' : 'pl-3 mt-1 space-y-1 border-l border-gray-100';
      
      items.forEach(item => {
        const li = document.createElement('li');
        
        const link = document.createElement('a');
        link.href = `#${item.id}`;
        link.className = 'toc-link text-gray-600 hover:text-indigo-600';
        link.textContent = item.text;
        link.setAttribute('data-level', level);
        
        // Add click handler
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateToSection(item.id);
        });
        
        li.appendChild(link);
        
        // Add children if any
        if (item.children && item.children.length > 0) {
          li.appendChild(renderItems(item.children, level + 1));
        }
        
        list.appendChild(li);
      });
      
      return list;
    };
    
    if (toc.length === 0) {
      container.innerHTML = '<p class="text-gray-500 italic">No table of contents available</p>';
    } else {
      container.appendChild(renderItems(toc));
    }
  }

  /**
   * Add reading controls to the ebook container
   */
  addReadingControls() {
    const container = document.getElementById('ebook-container');
    if (!container) return;
    
    // Check if controls already exist
    if (document.getElementById('ebook-reading-controls')) return;
    
    // Create reading controls with Vite-style
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'ebook-reading-controls';
    controlsDiv.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-indigo-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg z-40 transition-all duration-300';
    
    // Add control buttons
    controlsDiv.innerHTML = `
      <button id="focus-mode-btn" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Toggle Focus Mode">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </button>
      
      <div class="h-5 border-r border-white/20"></div>
      
      <button id="font-size-small" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Small Text">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      </button>
      <button id="font-size-medium" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Medium Text">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      </button>
      <button id="font-size-large" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Large Text">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      </button>
      
      <div class="h-5 border-r border-white/20"></div>
      
      <button id="theme-toggle-btn" class="p-2 hover:bg-indigo-500/50 rounded-full relative" title="Change Theme">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      </button>
      
      <div class="h-5 border-r border-white/20"></div>
      
      <button id="ebook-bookmark-btn" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Add Bookmark">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      </button>
      
      <button id="ebook-highlight-btn" class="p-2 hover:bg-indigo-500/50 rounded-full" title="Highlight Text">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
        </svg>
      </button>
      
      <button id="ebook-bookmarks-btn" class="p-2 hover:bg-indigo-500/50 rounded-full" title="View Bookmarks">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </button>
    `;
    
    container.appendChild(controlsDiv);
    
    // Show/hide controls on mouse movement
    let timeout;
    const showControls = () => {
      controlsDiv.classList.remove('opacity-0');
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        controlsDiv.classList.add('opacity-0');
      }, 3000);
    };
    
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      contentArea.addEventListener('mousemove', showControls);
      contentArea.addEventListener('scroll', showControls);
      contentArea.addEventListener('click', showControls);
    }
    
    // Add event listeners for control buttons
    document.getElementById('theme-toggle-btn').addEventListener('click', (e) => {
      this.showThemeSelector(e);
    });
    
    // Add direct event listeners to font size buttons
    document.getElementById('font-size-small').addEventListener('click', () => {
      this.changeFontSize('small');
    });
    
    document.getElementById('font-size-medium').addEventListener('click', () => {
      this.changeFontSize('medium');
    });
    
    document.getElementById('font-size-large').addEventListener('click', () => {
      this.changeFontSize('large');
    });
    
    // Add event listeners for other buttons
    document.getElementById('ebook-bookmark-btn').addEventListener('click', () => {
      this.toggleBookmark();
    });
    
    document.getElementById('ebook-highlight-btn').addEventListener('click', () => {
      this.highlightSelection();
    });
    
    document.getElementById('ebook-bookmarks-btn').addEventListener('click', () => {
      this.showBookmarksList();
    });
    
    document.getElementById('focus-mode-btn').addEventListener('click', () => {
      const container = document.getElementById('ebook-container');
      const isActive = container.classList.contains('focus-mode');
      
      if (window.ebookManager) {
        window.ebookManager.toggleFocusMode(!isActive);
      }
    });
    
    // Initially hide controls after 3s
    showControls();
  }

  /**
   * Process markdown content to extract TOC and enhance content
   * @param {string} markdown - Raw markdown content
   * @returns {Object} - Processed content and TOC
   */
  processContent(markdown) {
    const headings = [];
    
    // First pass: extract TOC
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let currentCodeBlock = null;  // Initialize currentCodeBlock
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      
      if (inCodeBlock) continue;
      
      // Extract headings
      if (line.startsWith('# ')) {
        headings.push({ level: 1, text: line.substring(2), id: this.slugify(line.substring(2)), line: i });
      } else if (line.startsWith('## ')) {
        headings.push({ level: 2, text: line.substring(3), id: this.slugify(line.substring(3)), line: i });
      } else if (line.startsWith('### ')) {
        headings.push({ level: 3, text: line.substring(4), id: this.slugify(line.substring(4)), line: i });
      }
    }
    
    // Second pass: enhance content with IDs and navigation
    let enhancedContent = '';
    inCodeBlock = false;
    let insideSection = false;
    let currentChapter = null;
    currentCodeBlock = null;  // Reset currentCodeBlock
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        
        // Check for Stackblitz marker in opening code block
        if (inCodeBlock && line.includes('stackblitz')) {
          // Extract Stackblitz ID or configuration if present
          const stackblitzConfig = line.replace('```stackblitz', '').trim();
          enhancedContent += `<div class="stackblitz-container" data-config="${this.escapeHtml(stackblitzConfig)}">`;
          enhancedContent += '<div class="code-content">';
          enhancedContent += line + '\n';
          currentCodeBlock = { isStackblitz: true, content: '' };
        } else {
          enhancedContent += line + '\n';
        }
        
        // Handle closing of a Stackblitz code block
        if (!inCodeBlock && currentCodeBlock && currentCodeBlock.isStackblitz) {
          enhancedContent += '</div>'; // Close code-content div
          enhancedContent += '<div class="stackblitz-runner-container hidden"></div>';
          enhancedContent += '<button class="run-in-stackblitz-btn">Run Code</button>';
          enhancedContent += '</div>'; // Close stackblitz-container div
          currentCodeBlock = null;
        }
        continue;
      }
      
      // Track if we're in a Stackblitz block
      if (inCodeBlock) {
        if (currentCodeBlock && currentCodeBlock.isStackblitz) {
          currentCodeBlock.content += line + '\n';
        }
        enhancedContent += line + '\n';
        continue;
      }
      
      if (!inCodeBlock) {
        // Add IDs to headings for navigation
        if (line.startsWith('# ')) {
          currentChapter = this.slugify(line.substring(2));
          if (insideSection) enhancedContent += '</section>\n';
          enhancedContent += `<section id="${currentChapter}" class="chapter">\n`;
          enhancedContent += `<h1 id="${this.slugify(line.substring(2))}">${line.substring(2)}</h1>\n`;
          insideSection = true;
        } else if (line.startsWith('## ')) {
          const id = this.slugify(line.substring(3));
          enhancedContent += `<h2 id="${id}">${line.substring(3)}</h2>\n`;
        } else if (line.startsWith('### ')) {
          const id = this.slugify(line.substring(4));
          enhancedContent += `<h3 id="${id}">${line.substring(4)}</h3>\n`;
        } else {
          enhancedContent += line + '\n';
        }
      } else {
        enhancedContent += line + '\n';
      }
    }
    
    if (insideSection) enhancedContent += '</section>\n';
    
    return {
      content: this.markdownToHtml(enhancedContent),
      toc: headings
    };
  }
  
  /**
   * Convert markdown to HTML
   * @param {string} markdown - Markdown content
   * @returns {string} - HTML content
   */
  markdownToHtml(markdown) {
    // Basic markdown to HTML conversion
    let html = markdown;
    
    // Process code blocks with Stackblitz support
    html = html.replace(/```([a-zA-Z]*)(.*?)\n([\s\S]*?)```/g, (match, lang, extra, code) => {
      // Check if this should be a stackblitz block (allow both ```javascript and ```js stackblitz)
      const isStackblitz = extra && extra.trim().includes('stackblitz');
      const escapedCode = this.escapeHtml(code);
      const uniqueId = `code-${Math.random().toString(36).substring(2, 9)}`;
      
      // Normalize language
      let language = lang || '';
      if (language === 'js') language = 'javascript';
      if (!language && isStackblitz) language = 'javascript';
      
      if (isStackblitz) {
        return `
          <div class="stackblitz-container" data-lang="${language}">
            <div class="code-header bg-gray-800 text-white text-xs py-1.5 px-3 flex justify-between items-center">
              <span>${language}</span>
              <div class="flex">
                <button class="copy-code-btn text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors mr-2" data-clipboard-target="#${uniqueId}">
                  <i class="far fa-copy mr-1"></i> Copy
                </button>
                <button class="run-in-stackblitz-btn text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors">
                  <i class="fas fa-play mr-1"></i> Run
                </button>
              </div>
            </div>
            <div class="vite-scrollbar overflow-auto max-h-[500px] p-4 bg-gray-900">
              <pre class="m-0"><code id="${uniqueId}" class="language-${language}" data-stackblitz="true">${escapedCode}</code></pre>
            </div>
            <div class="stackblitz-runner-container hidden"></div>
          </div>
        `;
      }
      
      // Regular code block (non-Stackblitz)
      return `
        <div class="code-block-container">
          <div class="code-header bg-gray-800 text-white text-xs py-1.5 px-3 flex justify-between items-center">
            <span>${lang || ''}</span>
            <button class="copy-code-btn text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors" data-clipboard-target="#${uniqueId}">
              <i class="far fa-copy mr-1"></i> Copy
            </button>
          </div>
          <div class="vite-scrollbar overflow-auto max-h-[500px] p-4 bg-gray-900">
            <pre class="m-0"><code id="${uniqueId}" class="language-${lang || ''}">${escapedCode}</code></pre>
          </div>
        </div>
      `;
    });
    
    // Continue with the rest of the conversion
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code bg-gray-100 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 hover:underline">$1</a>');
    
    // Convert bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert lists
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Convert numbered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, match => {
      // Only convert to <ol> if not already wrapped in <ul>
      if (!match.startsWith('<ul>')) {
        return '<ol>' + match + '</ol>';
      }
      return match;
    });
    
    // Convert paragraphs (lines that are not headings, lists, or code blocks)
    html = html.replace(/^([^<#\s][^\n]+)(?:\n|$)/gm, '<p>$1</p>');
    
    return html;
  }

  /**
   * Apply syntax highlighting to code blocks
   */
  applySyntaxHighlighting() {
    if (window.hljs) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      
      // Initialize clipboard for code blocks
      this.initializeClipboard();
      
      // Initialize Stackblitz runners
      this.initializeStackblitzRunners();
    }
  }

  /**
   * Initialize clipboard functionality for code blocks
   */
  initializeClipboard() {
    document.querySelectorAll('.copy-code-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const targetId = e.target.closest('.copy-code-btn').getAttribute('data-clipboard-target');
        const codeBlock = document.querySelector(targetId);
        
        if (codeBlock) {
          const textToCopy = codeBlock.textContent;
          
          // Use modern clipboard API
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              // Show success message
              const originalText = e.target.innerHTML;
              e.target.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
              setTimeout(() => {
                e.target.innerHTML = originalText;
              }, 2000);
            })
            .catch(err => {
              console.error('Failed to copy text: ', err);
              this.notificationManager.showToast('Failed to copy code', 'error');
            });
        }
      });
    });
  }

  /**
   * Initialize Stackblitz integration for code runners
   */
  initializeStackblitzRunners() {
    // Add inline icons for Font Awesome if needed
    const iconStyle = document.createElement('style');
    iconStyle.textContent = `
      .run-in-stackblitz-btn:before {
        content: "▶";
        margin-right: 4px;
      }
      .copy-code-btn:before {
        content: "📋";
        margin-right: 4px;
      }
    `;
    document.head.appendChild(iconStyle);

    // Find all run buttons and attach event listeners
    const runButtons = document.querySelectorAll('.run-in-stackblitz-btn');
    console.log(`Found ${runButtons.length} Stackblitz run buttons`);
    
    runButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const container = e.target.closest('.stackblitz-container');
        if (!container) return;
        
        const codeElement = container.querySelector('code');
        const runnerContainer = container.querySelector('.stackblitz-runner-container');
        if (!codeElement || !runnerContainer) return;
        
        // Toggle runner visibility
        if (runnerContainer.classList.contains('hidden')) {
          // Extract code and language
          const code = codeElement.textContent;
          const lang = container.getAttribute('data-lang') || 'javascript';
          
          // Show loading state
          runnerContainer.classList.remove('hidden');
          runnerContainer.innerHTML = `
            <div class="flex items-center justify-center p-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <span class="ml-2 text-indigo-600">Loading code runner...</span>
            </div>
          `;
          
          // First, load the SDK if it's not already loaded
          this.loadStackblitzSDK()
            .then(() => {
              // Then create Stackblitz VM
              this.createStackblitzProject(code, lang, runnerContainer);
            })
            .catch(err => {
              console.error('Error loading Stackblitz SDK:', err);
              runnerContainer.innerHTML = '<div class="p-4 text-red-500">Failed to load code runner</div>';
            });
          
          // Update button text
          button.textContent = 'Close Runner';
        } else {
          // Hide runner
          runnerContainer.classList.add('hidden');
          runnerContainer.innerHTML = '';
          button.innerHTML = '<i class="fas fa-play mr-1"></i> Run';
          button.textContent = 'Run Code';
        }
      });
    });
  }

  /**
   * Load the Stackblitz SDK
   * @returns {Promise} - Resolves when SDK is loaded
   */
  loadStackblitzSDK() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.StackBlitzSDK) {
        resolve(window.StackBlitzSDK);
        return;
      }
      
      // Load SDK script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
      script.async = true;
      script.onload = () => resolve(window.StackBlitzSDK);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Create and embed a Stackblitz project
   * @param {string} code - Code to run
   * @param {string} language - Programming language
   * @param {HTMLElement} container - Container element to embed in
   */
  createStackblitzProject(code, language, container) {
    try {
      // Determine file structure based on language
      let files = {};
      let dependencies = {};
      let title = 'HireMeNow Code Runner';
      
      switch (language) {
        case 'javascript':
        case 'js':
          files = {
            'index.js': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>JavaScript Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
  </html>`,
          };
          break;
          
        case 'typescript':
        case 'ts':
          files = {
            'index.ts': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>TypeScript Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.ts"></script>
  </body>
  </html>`,
          };
          dependencies = {
            'typescript': '^4.9.5'
          };
          break;
          
        case 'react':
        case 'jsx':
          files = {
            'index.js': `
  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App';

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );`,
            'App.jsx': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>React Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`,
          };
          dependencies = {
            'react': '^17.0.2',
            'react-dom': '^17.0.2'
          };
          break;
          
        default:
          files = {
            [`index.${language || 'js'}`]: code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Code Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.${language || 'js'}"></script>
  </body>
  </html>`,
          };
      }
      
      // Create project configuration
      const project = {
        title,
        description: 'Code example from HireMeNow',
        template: language === 'typescript' || language === 'ts' ? 'typescript' : 'javascript',
        files,
        dependencies
      };
      
      // Check if StackBlitzSDK is loaded
      if (!window.StackBlitzSDK) {
        throw new Error('StackBlitzSDK not loaded');
      }
      
      // Embed the project
      window.StackBlitzSDK.embedProject(
        container,
        project,
        {
          height: 400,
          openFile: Object.keys(files)[0],
          terminalHeight: 50,
          hideNavigation: false,
          hideDevTools: false,
          forceEmbedLayout: true,
          view: 'editor'
        }
      );
    } catch (error) {
      console.error('Error creating Stackblitz project:', error);
      
      // Show error in container
      container.innerHTML = `
        <div class="p-4 text-red-500">
          <p class="font-bold mb-2">Failed to create code runner</p>
          <p>${error.message || 'Unknown error'}</p>
          <p class="mt-4 text-sm text-gray-500">Please try again later</p>
        </div>
      `;
      
      // Show toast if notification manager is available
      if (this.notificationManager) {
        this.notificationManager.showToast('Error initializing code runner: ' + (error.message || 'Unknown error'), 'error');
      }
    }
  }

  /**
   * Get path to element for serialization
   * @param {HTMLElement} element - Element to get path for
   * @returns {Array} - Path to element
   */
  getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.getElementById('ebook-content')) {
      let index = 0;
      let sibling = current;
      
      while (sibling) {
        if (sibling.nodeName === current.nodeName) index++;
        sibling = sibling.previousElementSibling;
      }
      
      path.unshift({
        tag: current.nodeName.toLowerCase(),
        index
      });
      
      current = current.parentElement;
    }
    
    return path;
  }
  
  /**
   * Render table of contents
   * @param {Array} toc - Table of contents
   * @param {HTMLElement} container - Container element
   */
  renderTableOfContents(toc, container) {
    if (!container) return;
    
    let html = '<ul class="ebook-toc-list">';
    let currentLevel = 1;
    
    toc.forEach((item) => {
      if (item.level > currentLevel) {
        html += '<ul class="ebook-toc-sublist">';
        currentLevel = item.level;
      } else if (item.level < currentLevel) {
        html += '</ul>';
        currentLevel = item.level;
      }
      
      html += `<li>
        <a href="#${item.id}" class="toc-link" data-line="${item.line}">${item.text}</a>
      </li>`;
    });
    
    // Close any open lists
    for (let i = currentLevel; i > 0; i--) {
      html += '</ul>';
    }
    
    container.innerHTML = html;
    
    // Add click event listeners
    container.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.getAttribute('href').substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Update current section in UI
          this.highlightCurrentTocItem(link);
        }
      });
    });
  }
  
  /**
   * Highlight current TOC item
   * @param {HTMLElement} item - TOC item to highlight
   */
  highlightCurrentTocItem(item) {
    if (!item) return;
    
    // Remove active class from all items
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current item
    item.classList.add('active');
  }
  
  /**
   * Apply syntax highlighting to code blocks
   */
  applySyntaxHighlighting() {
    if (window.hljs) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      
      // Initialize clipboard for code blocks
      this.initializeClipboard();
      
      // Initialize Stackblitz runners
      this.initializeStackblitzRunners();
    }
  }
  
  /**
   * Initialize clipboard functionality for code blocks
   */
  initializeClipboard() {
    document.querySelectorAll('.copy-code-btn').forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-clipboard-target');
        const codeElement = document.querySelector(targetId);
        
        if (codeElement) {
          const textToCopy = codeElement.textContent;
          
          // Use the Clipboard API if available
          if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
              .then(() => {
                // Show copied feedback with animation
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-green-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                `;
                button.classList.add('text-green-500');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                  button.innerHTML = originalHTML;
                  button.classList.remove('text-green-500');
                }, 2000);
              })
              .catch(err => {
                console.error('Could not copy text: ', err);
                this.notificationManager.showToast('Failed to copy to clipboard', 'error');
              });
          } else {
            // Fallback for browsers without Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
              document.execCommand('copy');
              const originalHTML = button.innerHTML;
              button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              `;
              button.classList.add('text-green-500');
              
              setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('text-green-500');
              }, 2000);
            } catch (err) {
              console.error('Could not copy text: ', err);
              this.notificationManager.showToast('Failed to copy to clipboard', 'error');
            }
            
            document.body.removeChild(textarea);
          }
        }
      });
    });
  }
  
  /**
   * Initialize Stackblitz integration for code runners
   */
  initializeStackblitzRunners() {
    // Add inline icons for Font Awesome if needed
    const iconStyle = document.createElement('style');
    iconStyle.textContent = `
      .run-in-stackblitz-btn:before {
        content: "▶";
        margin-right: 4px;
      }
      .copy-code-btn:before {
        content: "📋";
        margin-right: 4px;
      }
    `;
    document.head.appendChild(iconStyle);

    // Find all run buttons and attach event listeners
    const runButtons = document.querySelectorAll('.run-in-stackblitz-btn');
    console.log(`Found ${runButtons.length} Stackblitz run buttons`);
    
    runButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const container = e.target.closest('.stackblitz-container');
        if (!container) return;
        
        const codeElement = container.querySelector('code');
        const runnerContainer = container.querySelector('.stackblitz-runner-container');
        if (!codeElement || !runnerContainer) return;
        
        // Toggle runner visibility
        if (runnerContainer.classList.contains('hidden')) {
          // Extract code and language
          const code = codeElement.textContent;
          const lang = container.getAttribute('data-lang') || 'javascript';
          
          // Show loading state
          runnerContainer.classList.remove('hidden');
          runnerContainer.innerHTML = `
            <div class="flex items-center justify-center p-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <span class="ml-2 text-indigo-600">Loading code runner...</span>
            </div>
          `;
          
          // First, load the SDK if it's not already loaded
          this.loadStackblitzSDK()
            .then(() => {
              // Then create Stackblitz VM
              this.createStackblitzProject(code, lang, runnerContainer);
            })
            .catch(err => {
              console.error('Error loading Stackblitz SDK:', err);
              runnerContainer.innerHTML = '<div class="p-4 text-red-500">Failed to load code runner</div>';
            });
          
          // Update button text
          button.textContent = 'Close Runner';
        } else {
          // Hide runner
          runnerContainer.classList.add('hidden');
          runnerContainer.innerHTML = '';
          button.innerHTML = '<i class="fas fa-play mr-1"></i> Run';
          button.textContent = 'Run Code';
        }
      });
    });
  }

  /**
   * Load the Stackblitz SDK
   * @returns {Promise} - Resolves when SDK is loaded
   */
  loadStackblitzSDK() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.StackBlitzSDK) {
        resolve(window.StackBlitzSDK);
        return;
      }
      
      // Load SDK script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js';
      script.async = true;
      script.onload = () => resolve(window.StackBlitzSDK);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Create and embed a Stackblitz project
   * @param {string} code - Code to run
   * @param {string} language - Programming language
   * @param {HTMLElement} container - Container element to embed in
   */
  createStackblitzProject(code, language, container) {
    try {
      // Determine file structure based on language
      let files = {};
      let dependencies = {};
      let title = 'HireMeNow Code Runner';
      
      switch (language) {
        case 'javascript':
        case 'js':
          files = {
            'index.js': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>JavaScript Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
  </html>`,
          };
          break;
          
        case 'typescript':
        case 'ts':
          files = {
            'index.ts': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>TypeScript Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.ts"></script>
  </body>
  </html>`,
          };
          dependencies = {
            'typescript': '^4.9.5'
          };
          break;
          
        case 'react':
        case 'jsx':
          files = {
            'index.js': `
  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App';

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );`,
            'App.jsx': code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>React Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`,
          };
          dependencies = {
            'react': '^17.0.2',
            'react-dom': '^17.0.2'
          };
          break;
          
        default:
          files = {
            [`index.${language || 'js'}`]: code,
            'index.html': `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Code Runner</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="index.${language || 'js'}"></script>
  </body>
  </html>`,
          };
      }
      
      // Create project configuration
      const project = {
        title,
        description: 'Code example from HireMeNow',
        template: language === 'typescript' || language === 'ts' ? 'typescript' : 'javascript',
        files,
        dependencies
      };
      
      // Check if StackBlitzSDK is loaded
      if (!window.StackBlitzSDK) {
        throw new Error('StackBlitzSDK not loaded');
      }
      
      // Embed the project
      window.StackBlitzSDK.embedProject(
        container,
        project,
        {
          height: 400,
          openFile: Object.keys(files)[0],
          terminalHeight: 50,
          hideNavigation: false,
          hideDevTools: false,
          forceEmbedLayout: true,
          view: 'editor'
        }
      );
    } catch (error) {
      console.error('Error creating Stackblitz project:', error);
      
      // Show error in container
      container.innerHTML = `
        <div class="p-4 text-red-500">
          <p class="font-bold mb-2">Failed to create code runner</p>
          <p>${error.message || 'Unknown error'}</p>
          <p class="mt-4 text-sm text-gray-500">Please try again later</p>
        </div>
      `;
      
      // Show toast if notification manager is available
      if (this.notificationManager) {
        this.notificationManager.showToast('Error initializing code runner: ' + (error.message || 'Unknown error'), 'error');
      }
    }
  }

  /**
   * Navigate to a specific section
   * @param {string} sectionId - ID of the section to navigate to
   */
  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Scroll to the section
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      contentArea.scrollTop = section.offsetTop - 20;
    }
    
    // Update active TOC item
    const tocItem = document.querySelector(`.toc-link[href="#${sectionId}"]`);
    if (tocItem) {
      this.highlightCurrentTocItem(tocItem);
    }
  }

  /**
   * Toggle bookmark for current position
   */
  toggleBookmark() {
    const currentHeading = this.getCurrentHeading();
    if (!currentHeading) return;
    
    const { id, text } = currentHeading;
    const bookmarkExists = this.bookmarks.some(b => b.id === id && b.bookId === this.currentBook.id);
    
    if (bookmarkExists) {
      // Remove bookmark
      this.bookmarks = this.bookmarks.filter(b => !(b.id === id && b.bookId === this.currentBook.id));
      this.notificationManager.showToast('Bookmark removed', 'info');
    } else {
      // Add bookmark
      this.bookmarks.push({
        id,
        text,
        bookId: this.currentBook.id,
        date: new Date().toISOString()
      });
      this.notificationManager.showToast('Bookmark added', 'success');
    }
    
    this.saveBookmarks();
    this.applyBookmarks();
  }
  
  /**
   * Get current heading based on scroll position
   * @returns {Object|null} - Current heading or null
   */
  getCurrentHeading() {
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return null;
    
    const headings = Array.from(document.querySelectorAll('#ebook-content h1, #ebook-content h2, #ebook-content h3'));
    if (!headings.length) return null;
    
    const scrollPosition = contentArea.scrollTop;
    const containerHeight = contentArea.clientHeight;
    let currentHeading = null;
    
    // Find the heading that's currently in the viewport or just above it
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const headingPosition = heading.offsetTop - contentArea.offsetTop;
      
      // If the heading is above or at the current scroll position (+margin for better UX)
      if (headingPosition <= scrollPosition + 100) {
        currentHeading = {
          id: heading.id,
          text: heading.textContent,
          element: heading
        };
      }
      // If we've gone past the viewport, stop searching
      else if (headingPosition > scrollPosition + containerHeight) {
        break;
      }
    }
    
    // If no heading is found, default to the first one
    return currentHeading || (headings.length ? { 
      id: headings[0].id, 
      text: headings[0].textContent, 
      element: headings[0] 
    } : null);
  }
  
  /**
   * Highlight selected text
   */
  highlightSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    // Check if selection is within the content area
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea.contains(range.commonAncestorContainer)) return;
    
    // Create a highlight span
    const highlightId = 'highlight-' + Date.now();
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'ebook-highlight';
    highlightSpan.id = highlightId;
    
    // Insert highlight span
    try {
      range.surroundContents(highlightSpan);
      
      // Save highlight
      this.highlights.push({
        id: highlightId,
        bookId: this.currentBook.id,
        text: highlightSpan.textContent,
        path: this.getElementPath(highlightSpan),
        date: new Date().toISOString()
      });
      
      this.saveHighlights();
      this.notificationManager.showToast('Text highlighted', 'success');
    } catch (error) {
      console.error('Error highlighting text:', error);
      this.notificationManager.showToast('Could not highlight selection', 'error');
    }
    
    // Clear selection
    selection.removeAllRanges();
  }
  
  /**
   * Get path to element for serialization
   * @param {HTMLElement} element - Element to get path for
   * @returns {Array} - Path to element
   */
  getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.getElementById('ebook-content')) {
      let index = 0;
      let sibling = current;
      
      while (sibling) {
        if (sibling.nodeName === current.nodeName) index++;
        sibling = sibling.previousElementSibling;
      }
      
      path.unshift({
        tag: current.nodeName.toLowerCase(),
        index
      });
      
      current = current.parentElement;
    }
    
    return path;
  }
  
  /**
   * Apply saved bookmarks to the UI
   */
  applyBookmarks() {
    // Clear existing bookmark indicators
    document.querySelectorAll('.bookmark-indicator').forEach(el => el.remove());
    
    // Add bookmark indicators
    this.bookmarks.forEach(bookmark => {
      if (bookmark.bookId !== this.currentBook.id) return;
      
      const element = document.getElementById(bookmark.id);
      if (element) {
        const indicator = document.createElement('span');
        indicator.className = 'bookmark-indicator';
        indicator.innerHTML = '<i class="fas fa-bookmark"></i>';
        element.prepend(indicator);
      }
    });
  }
  
  /**
   * Apply saved highlights to the UI
   */
  applyHighlights() {
    try {
      if (!this.currentBook || !this.highlights.length) return;
      
      const contentArea = document.getElementById('ebook-content');
      if (!contentArea) return;
      
      // Find highlights for current book
      const bookHighlights = this.highlights.filter(h => h.bookId === this.currentBook.id);
      if (!bookHighlights.length) return;
      
      // Apply each highlight
      bookHighlights.forEach(highlight => {
        try {
          // Simple highlighting based on text content rather than path
          const textToHighlight = highlight.text;
          
          if (!textToHighlight) return;
          
          // Find text nodes that contain this text
          const textNodes = [];
          const walker = document.createTreeWalker(
            contentArea,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode(node) {
                // Skip nodes in pre/code blocks
                if (node.parentNode.closest('pre, code')) {
                  return NodeFilter.FILTER_REJECT;
                }
                return node.textContent.includes(textToHighlight) 
                  ? NodeFilter.FILTER_ACCEPT 
                  : NodeFilter.FILTER_REJECT;
              }
            }
          );
          
          let node;
          while ((node = walker.nextNode())) {
            textNodes.push(node);
          }
          
          // Apply highlight to found nodes
          textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const index = text.indexOf(textToHighlight);
            
            if (index !== -1) {
              // Split the text node into three parts
              const before = text.substring(0, index);
              const highlighted = text.substring(index, index + textToHighlight.length);
              const after = text.substring(index + textToHighlight.length);
              
              const fragment = document.createDocumentFragment();
              
              // Add the text before the highlight
              if (before) {
                fragment.appendChild(document.createTextNode(before));
              }
              
              // Create the highlighted span
              const highlightSpan = document.createElement('span');
              highlightSpan.className = 'ebook-highlight';
              highlightSpan.textContent = highlighted;
              fragment.appendChild(highlightSpan);
              
              // Add the text after the highlight
              if (after) {
                fragment.appendChild(document.createTextNode(after));
              }
              
              // Replace the text node with our fragment
              textNode.parentNode.replaceChild(fragment, textNode);
            }
          });
        } catch (error) {
          console.error('Error applying individual highlight:', error);
        }
      });
    } catch (error) {
      console.error('Error applying highlights:', error);
    }
  }
  
  /**
   * Change font size
   * @param {string} size - Font size (small, medium, large)
   */
  changeFontSize(size) {
    this.fontSize = size;
    localStorage.setItem('ebookFontSize', size);
    this.applyFontSize();
    this.notificationManager.showToast(`Font size changed to ${size}`, 'info');
  }
  
  /**
   * Apply current font size setting
   */
  applyFontSize() {
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return;
    
    contentArea.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (this.fontSize) {
      case 'small':
        contentArea.classList.add('text-sm');
        break;
      case 'medium':
        contentArea.classList.add('text-base');
        break;
      case 'large':
        contentArea.classList.add('text-lg');
        break;
      default:
        contentArea.classList.add('text-base');
    }
  }
  
  /**
   * Save bookmarks to localStorage
   */
  saveBookmarks() {
    localStorage.setItem('ebook-bookmarks', JSON.stringify(this.bookmarks));
  }
  
  /**
   * Load bookmarks from localStorage
   * @returns {Array} - Array of bookmarks
   */
  loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('ebook-bookmarks')) || [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }
  
  /**
   * Save highlights to localStorage
   */
  saveHighlights() {
    localStorage.setItem('ebook-highlights', JSON.stringify(this.highlights));
  }
  
  /**
   * Load highlights from localStorage
   * @returns {Array} - Array of highlights
   */
  loadHighlights() {
    try {
      return JSON.parse(localStorage.getItem('ebook-highlights')) || [];
    } catch (error) {
      console.error('Error loading highlights:', error);
      return [];
    }
  }
  
  /**
   * Save current scroll position
   */
  saveScrollPosition() {
    if (!this.currentBook) return;
    
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      // Ensure lastScrollPosition is initialized
      if (!this.lastScrollPosition) {
        this.lastScrollPosition = {};
      }
      
      this.lastScrollPosition[this.currentBook.id] = contentArea.scrollTop;
      
      try {
        localStorage.setItem('ebook-scroll', JSON.stringify(this.lastScrollPosition));
      } catch (e) {
        console.error('Error saving scroll position to localStorage:', e);
      }
    }
  }
  
  /**
   * Restore saved scroll position
   */
  restoreScrollPosition() {
    if (!this.currentBook) return;
    
    try {
      const scrollData = localStorage.getItem('ebook-scroll');
      if (scrollData) {
        this.lastScrollPosition = JSON.parse(scrollData) || {};
      }
      
      const contentArea = document.getElementById('ebook-content');
      if (contentArea && this.lastScrollPosition[this.currentBook.id]) {
        // Use a setTimeout to ensure content is fully rendered
        setTimeout(() => {
          contentArea.scrollTop = this.lastScrollPosition[this.currentBook.id];
          // Update TOC highlighting based on restored position
          this.updateCurrentTocItem();
        }, 150);
      }
    } catch (error) {
      console.error('Error restoring scroll position:', error);
    }
  }
  
  /**
   * Show bookmarks list
   */
  showBookmarksList() {
    if (!this.currentBook) return;
    
    const bookmarks = this.bookmarks.filter(b => b.bookId === this.currentBook.id);
    
    if (bookmarks.length === 0) {
      this.notificationManager.showToast('No bookmarks in this book', 'info');
      return;
    }
    
    // Create modern modal for bookmarks
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    const content = document.createElement('div');
    content.className = 'bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col animate-scale-in';
    
    content.innerHTML = `
      <div class="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 class="font-bold text-lg text-indigo-900">Your Bookmarks</h3>
        <button class="close-modal text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="overflow-y-auto p-4 space-y-2 flex-1">
        ${bookmarks.map(bookmark => `
          <div class="bookmark-item p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer transition-all" data-id="${bookmark.id}">
            <div class="flex justify-between">
              <span class="text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5 inline-block">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </span>
              <button class="delete-bookmark text-gray-400 hover:text-red-500" data-id="${bookmark.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
            <p class="mt-1 text-sm">${bookmark.text}</p>
            <p class="text-xs text-gray-500 mt-1">${new Date(bookmark.date).toLocaleDateString()}</p>
          </div>
        `).join('')}
      </div>
    `;
    
    modal.appendChild(content);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Close button
    content.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Navigate to bookmark on click
    content.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.delete-bookmark')) {
          const id = item.getAttribute('data-id');
          this.navigateToSection(id);
          document.body.removeChild(modal);
        }
      });
    });
    
    // Delete bookmark
    content.querySelectorAll('.delete-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.bookmarks = this.bookmarks.filter(b => !(b.id === id && b.bookId === this.currentBook.id));
        this.saveBookmarks();
        this.applyBookmarks();
        document.body.removeChild(modal);
        this.notificationManager.showToast('Bookmark deleted', 'info');
      });
    });
    
    // Add modal to page
    document.body.appendChild(modal);
  }

  /**
   * Bind events for eBook reader
   */
  bindEvents() {
    // Most button handlers are now attached directly in addReadingControls
    
    // Save scroll position and update TOC when user scrolls
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      // Use throttled scroll handler to improve performance
      let scrollTimer;
      contentArea.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        
        scrollTimer = setTimeout(() => {
          this.saveScrollPosition();
          this.updateCurrentTocItem();
        }, 100); // Throttle to every 100ms
      });
    }
    
    // Use Intersection Observer to highlight current heading in TOC
    if (window.IntersectionObserver) {
      this.setupHeadingObserver();
    }
  }
  
  /**
   * Set up an observer to watch headings and update TOC accordingly
   */
  setupHeadingObserver() {
    const contentArea = document.getElementById('ebook-content');
    if (!contentArea) return;
    
    // Clean up existing observer if any
    if (this.headingObserver) {
      this.headingObserver.disconnect();
    }
    
    const headings = document.querySelectorAll('#ebook-content h1, #ebook-content h2, #ebook-content h3');
    
    // Create new intersection observer
    this.headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const tocItem = document.querySelector(`.toc-link[href="#${id}"]`);
          if (tocItem) {
            this.highlightCurrentTocItem(tocItem);
          }
        }
      });
    }, { 
      rootMargin: '-10% 0px -80% 0px', // Consider a heading "visible" when in the top 20% of the viewport
      threshold: 0.1
    });
    
    // Observe all headings
    headings.forEach(heading => {
      if (heading.id) {
        this.headingObserver.observe(heading);
      }
    });
  }
  
  /**
   * Clean up resources when switching books or tabs
   */
  cleanup() {
    // Save current state
    this.saveScrollPosition();
    
    // Clean up intersection observer
    if (this.headingObserver) {
      this.headingObserver.disconnect();
    }
    
    // Clean up event listeners - not necessary since we're using unique IDs, but good practice
    const contentArea = document.getElementById('ebook-content');
    if (contentArea) {
      // We don't remove scroll listeners as they're bound to DOM elements that will be removed anyway
    }
  }

  /**
   * Apply current theme settings
   */
  applyTheme() {
    const contentArea = document.getElementById('ebook-content');
    const container = document.getElementById('ebook-container');
    if (!contentArea || !container) return;
    
    // Clear previous theme classes
    const themeClasses = Object.values(this.availableThemes)
      .map(theme => `${theme.bgColor} ${theme.textColor}`).join(' ');
    
    contentArea.classList.remove(...themeClasses.split(' '));
    
    // Apply current theme
    const theme = this.availableThemes[this.theme] || this.availableThemes.default;
    contentArea.classList.add(theme.bgColor, theme.textColor);
    
    // Set theme attribute for CSS targeting
    container.setAttribute('data-theme', this.theme);
    
    // Save theme preference
    localStorage.setItem('ebookTheme', this.theme);
  }

  /**
   * Show theme selector
   * @param {Event} event - Click event
   */
  showThemeSelector(event) {
    // Prevent event from bubbling up
    event.stopPropagation();
    
    // Create theme selector dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-xl z-50 animate-scale-in';
    
    const themesList = document.createElement('div');
    themesList.className = 'grid grid-cols-2 gap-2';
    
    // Add theme options
    Object.entries(this.availableThemes).forEach(([key, theme]) => {
      const themeOption = document.createElement('button');
      themeOption.className = `p-2 rounded-md text-center ${key === this.theme ? 'ring-2 ring-indigo-500' : ''}`;
      themeOption.style.backgroundColor = theme.bgColor.replace('bg-', '');
      themeOption.style.color = theme.textColor.replace('text-', '');
      themeOption.textContent = theme.name;
      
      themeOption.addEventListener('click', () => {
        this.theme = key;
        this.applyTheme();
        this.notificationManager.showToast(`Theme changed to ${theme.name}`, 'info');
        document.body.removeChild(dropdown);
      });
      
      themesList.appendChild(themeOption);
    });
    
    dropdown.appendChild(themesList);
    
    // Position and add to document
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(dropdown);
    
    // Close when clicking outside
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && e.target !== button) {
        document.body.removeChild(dropdown);
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    // Add click listener after a small delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 100);
  }

  /**
   * Escape HTML special characters
   * @param {string} html - Raw HTML
   * @returns {string} - Escaped HTML
   */
  escapeHtml(html) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return html.replace(/[&<>"']/g, m => escapeMap[m]);
  }

  /**
   * Convert string to URL-friendly slug
   * @param {string} text - Text to slugify
   * @returns {string} - Slugified text
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -
  }
}
