/**
 * Fallback functions to ensure eBooks are displayed correctly
 */
export function ensureEbookVisibility() {
  // This function ensures ebook catalog visibility in case the manager doesn't load properly
  
  // Force load all vite-section elements
  document.querySelectorAll('.vite-section').forEach(section => {
    section.classList.add('loaded');
  });
  
  // Display a sample book if the catalog is empty
  const libraryContainer = document.getElementById('ebook-library');
  if (libraryContainer && libraryContainer.children.length <= 1) {
    // Clear loading spinner
    libraryContainer.innerHTML = '';
    
    // Create sample book
    const sampleBook = {
      id: 'js-prototypes',
      title: 'JavaScript Prototypes and Inheritance',
      description: 'A comprehensive guide to JavaScript prototypes, inheritance patterns, and performance optimization techniques.',
      cover: '',
      author: 'HireMeNow Team',
      chapters: 8
    };
    
    // Create and append card
    const bookCard = document.createElement('div');
    bookCard.className = 'ebook-library-card spotlight-card vite-section loaded';
    
    bookCard.innerHTML = `
      <div class="ebook-card h-full flex flex-col">
        <div class="overflow-hidden h-40 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-5xl font-bold text-indigo-600/20">${sampleBook.title.charAt(0)}</span>
          </div>
          <div class="absolute top-2 right-2 text-xs px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-indigo-600 font-medium">
            ${sampleBook.chapters} chapters
          </div>
        </div>
        
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-bold text-gray-800 mb-1">${sampleBook.title}</h3>
          <p class="text-sm text-gray-600 mb-3 flex-1">${sampleBook.description.substring(0, 80)}${sampleBook.description.length > 80 ? '...' : ''}</p>
          
          <div class="mt-auto">
            <div class="flex justify-between text-xs text-gray-500 mb-2">
              <span>${sampleBook.author}</span>
              <span>Not started</span>
            </div>
            
            <div class="reading-progress-bar mb-3">
              <div class="reading-progress-value" style="width: 0%"></div>
            </div>
            
            <button class="read-book-btn w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors" data-book-id="${sampleBook.id}">
              Start Reading
            </button>
          </div>
        </div>
      </div>
      
      <div class="ebook-card-overlay">
        <button class="read-book-btn py-2 px-6 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors" data-book-id="${sampleBook.id}">
          Start Reading
        </button>
      </div>
    `;
    
    libraryContainer.appendChild(bookCard);
    
    // Add event listener to the read button
    const readButtons = bookCard.querySelectorAll('.read-book-btn');
    readButtons.forEach(button => {
      button.addEventListener('click', () => {
        // If ebookManager exists, use it
        if (window.ebookManager) {
          window.ebookManager.openBook(sampleBook.id);
        } else {
          // Navigate to the ebook route with book parameter
          if (window.appRouter) {
            window.appRouter.navigate('ebook', { book: sampleBook.id });
          }
        }
      });
    });
  }
}

/**
 * Provides a fallback book content in case the real content fails to load
 * @param {string} bookId - ID of the book to provide content for
 * @returns {string|null} - Markdown content or null if book ID is not supported
 */
export function getFallbackBookContent(bookId) {
  if (bookId === 'js-prototypes') {
    return `# JavaScript Prototypes and Inheritance

## Introduction to JavaScript Prototypes

JavaScript is a prototype-based language, which means objects inherit properties and methods from prototype objects. This is different from class-based languages.

### What is a Prototype?

In JavaScript, every object has a hidden property called [[Prototype]] (exposed via __proto__) that links to another object called its prototype. Properties and methods are first looked up on the object itself, and if not found, on its prototype, and so on.

\`\`\`javascript
// Basic example of prototype
const animal = {
  makeSound: function() {
    console.log('Some generic sound');
  }
};

const dog = Object.create(animal);
dog.makeSound = function() {
  console.log('Woof! Woof!');
};

dog.makeSound(); // "Woof! Woof!"
\`\`\`

## Understanding Prototype Chain

Objects in JavaScript form a chain called the prototype chain. When you try to access a property, JavaScript first looks at the object itself. If it doesn't find it, it looks at the object's prototype, then that object's prototype, and so on until it reaches Object.prototype.

\`\`\`javascript
// Prototype chain example
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(this.name + ' makes a noise.');
};

function Dog(name) {
  Animal.call(this, name);
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  console.log(this.name + ' barks.');
};

const dog = new Dog('Rex');
dog.speak(); // "Rex barks."
\`\`\`

## ES6 Classes and Prototypes

ES6 introduced class syntax, but it's just syntactic sugar over JavaScript's prototype-based inheritance.

\`\`\`javascript
// ES6 class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + ' barks.');
  }
}

const dog = new Dog('Rex');
dog.speak(); // "Rex barks."
\`\`\`

## Performance Optimization with Prototypes

One of the main benefits of prototypes is memory efficiency. Methods defined on the prototype are shared among all instances, saving memory.

\`\`\`javascript
// Bad approach (memory inefficient)
function BadCar(model) {
  this.model = model;
  this.drive = function() { 
    console.log('Driving a ' + this.model);
  };
}

// Good approach (memory efficient)
function GoodCar(model) {
  this.model = model;
}

GoodCar.prototype.drive = function() {
  console.log('Driving a ' + this.model);
};
\`\`\`

## Common Inheritance Patterns

There are several common inheritance patterns in JavaScript:

1. **Constructor inheritance**: Using call/apply to execute the parent constructor in the context of the child.
2. **Prototype chain inheritance**: Setting the child's prototype to an instance of the parent.
3. **Combination inheritance**: Using both of the above.
4. **Parasitic inheritance**: A function that augments an existing object and returns it.
5. **Functional inheritance**: Using closures to achieve private state.

## Best Practices

When working with prototypes:

1. Avoid extending native prototypes.
2. Use ES6 classes for cleaner syntax when appropriate.
3. Understand that this is prototype-based, not class-based.
4. Use composition over inheritance when appropriate.
5. Keep prototype chains short for performance.

## Summary

JavaScript's prototype system is powerful but can be confusing if you're used to classical inheritance. The key points to remember are:

- Every object has a prototype (except Object.prototype)
- Objects inherit from prototypes, not classes
- ES6 classes are syntactic sugar over prototype-based inheritance
- Method sharing through prototypes is memory-efficient
- The prototype chain is used for property and method lookup`;
  }
  return null;
}
