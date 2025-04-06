export class QuestionDatabase {
  constructor() {
    this.topics = {
      'js-basics': {
        title: 'JavaScript',
        description:
          'Common JavaScript questions that interviewers frequently ask to test your fundamental knowledge.',
        sections: [
          {
            title: 'Core Concepts',
            items: [
              {
                question: 'What is the difference between let, const, and var?',
                answer:
                  'var is function scoped and can be redeclared and updated. let is block scoped and can be updated but not redeclared. const is block scoped and cannot be updated or redeclared.',
                codeExample: `// var example - function scoped
function example() {
  if (true) {
    var x = 'hello';  // exists in function scope
  }
  console.log(x);  // 'hello' - still accessible
}

// let example - block scoped
function example() {
  if (true) {
    let y = 'hello';  // exists only in this block
  }
  console.log(y);  // ReferenceError: y is not defined
}

// const example - block scoped and immutable binding
const z = { name: 'John' };
z.name = 'Jane';    // OK - modifying properties is allowed
z = { name: 'Jane' };  // Error - reassignment is not allowed`,
                language: 'javascript',
                tips: [
                  'Always prefer const by default, use let only when you need to reassign',
                  'Avoid var in modern JavaScript code',
                  "Remember that const prevents reassignment, but doesn't make objects immutable",
                ],
              },
              {
                question: 'How does prototypal inheritance work in JavaScript?',
                answer:
                  'In JavaScript, objects inherit properties from other objects through prototypes. Each object has a private property that holds a link to another object called its prototype.',
                codeExample: `// Constructor function
function Person(name) {
  this.name = name;
}

// Adding a method to the prototype
Person.prototype.sayHello = function() {
  return \`Hello, my name is \${this.name}\`;
};

// Inheritance
function Employee(name, position) {
  Person.call(this, name);  // Call parent constructor
  this.position = position;
}

// Set up prototype chain: Employee → Person → Object
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// Adding a method to Employee.prototype
Employee.prototype.getRole = function() {
  return this.position;
};

// Usage
const john = new Employee('John', 'Developer');
console.log(john.sayHello());  // "Hello, my name is John"
console.log(john.getRole());   // "Developer"`,
                language: 'javascript',
                tips: [
                  "Modern JavaScript uses class syntax, but it's still prototypal inheritance under the hood",
                  'Object.create() allows you to create an object with a specific prototype',
                  'Check if a property exists on an object itself (not its prototype) with hasOwnProperty()',
                ],
              },
            ],
          },
          {
            title: 'Closures and Scope',
            items: [
              {
                question: 'What is a closure in JavaScript and how would you use it?',
                answer:
                  'A closure is the combination of a function and the lexical environment within which that function was declared. It allows a function to access variables from its parent scope even after the parent function has closed.',
                codeExample: `function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1
console.log(counter.getValue());   // 1

// count variable is not accessible directly
console.log(count);  // ReferenceError`,
                language: 'javascript',
                tips: [
                  'Closures are useful for data encapsulation and creating private variables',
                  'Be careful with closures in loops - they capture variables by reference, not value',
                  'Closures can lead to memory leaks if not used carefully, as they keep references to outer variables',
                ],
              },
            ],
          },
        ],
      },
      algorithm: {
        title: 'Algorithm Questions',
        description: 'Common algorithm problems you might encounter in a technical interview.',
        sections: [
          {
            title: 'Array Manipulation',
            items: [
              {
                question:
                  'How would you find the pair of numbers in an array that sum to a specific target?',
                answer:
                  'You can solve this problem using a hash map (object) to store visited numbers and check if the complement exists.',
                codeExample: `function twoSum(nums, target) {
  const visited = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (complement in visited) {
      return [visited[complement], i];
    }
    
    visited[nums[i]] = i;
  }
  
  return null;  // No pair found
}

// Example usage
const numbers = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(numbers, target));  // [0, 1] (2 + 7 = 9)`,
                language: 'javascript',
                tips: [
                  'This solution has O(n) time complexity with one pass through the array',
                  'Using a hash map is more efficient than nested loops (which would be O(n²))',
                  'Always check edge cases: empty array, no valid pairs, duplicate numbers',
                ],
              },
            ],
          },
        ],
      },
      'system-design': {
        title: 'System Design',
        description:
          'System design concepts and questions commonly asked in senior-level interviews.',
        sections: [
          {
            title: 'Basics',
            items: [
              {
                question: 'How would you design a URL shortener service like bit.ly?',
                answer:
                  'A URL shortener converts long URLs into shorter, unique aliases to make links more manageable. Key components include API services, database storage, and a redirect mechanism.',
                codeExample: `// Example URL shortener algorithm in JavaScript

// 1. Generate a short URL using base62 encoding (a-z, A-Z, 0-9)
function generateShortUrl(id) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const base = characters.length;
  let shortUrl = '';
  
  while (id > 0) {
    shortUrl = characters[id % base] + shortUrl;
    id = Math.floor(id / base);
  }
  
  return shortUrl;
}

// 2. Store URL mapping in database
class UrlShortener {
  constructor() {
    this.urlDatabase = new Map();
    this.idCounter = 1;
  }
  
  shorten(originalUrl) {
    // Check if URL already exists to avoid duplicates
    for (const [shortUrl, url] of this.urlDatabase.entries()) {
      if (url === originalUrl) return shortUrl;
    }
    
    const id = this.idCounter++;
    const shortUrl = generateShortUrl(id);
    this.urlDatabase.set(shortUrl, originalUrl);
    return shortUrl;
  }
  
  redirect(shortUrl) {
    return this.urlDatabase.get(shortUrl) || null;
  }
}

// Usage
const shortener = new UrlShortener();
const shortUrl = shortener.shorten('https://www.example.com/very/long/path');
console.log(shortUrl);  // Something like "b3"
console.log(shortener.redirect(shortUrl));  // https://www.example.com/very/long/path`,
                language: 'javascript',
                tips: [
                  "In a real system, you'd use a database like Redis for caching frequently accessed URLs",
                  'Consider distributed systems to handle high load with multiple servers',
                  'Add analytics tracking to count clicks and provide user insights',
                  'Implement rate limiting to prevent abuse of the service',
                ],
              },
            ],
          },
        ],
      },
      behavior: {
        title: 'Behavioral Questions',
        description:
          'Common behavioral interview questions and strategies for answering them effectively.',
        sections: [
          {
            title: 'Teamwork & Collaboration',
            items: [
              {
                question: 'Describe a time when you had to work with a difficult team member.',
                answer:
                  'When answering this question, use the STAR method (Situation, Task, Action, Result) to structure your response. Focus on how you handled the situation professionally and what you learned from it.',
                tips: [
                  'Emphasize communication skills and conflict resolution',
                  'Avoid speaking negatively about the other person',
                  'Highlight the positive outcome and lessons learned',
                  'Demonstrate empathy and understanding of different perspectives',
                ],
              },
              {
                question: 'Tell me about a time you led a project. How did you manage the team?',
                answer:
                  'This question assesses your leadership skills. Describe a specific project where you had leadership responsibilities. Explain how you set goals, motivated team members, resolved conflicts, and ultimately achieved the project objectives.',
                tips: [
                  'Mention specific leadership techniques you used',
                  "Talk about how you delegated tasks based on team members' strengths",
                  'Discuss how you handled any challenges or setbacks',
                  'Include metrics or results that demonstrate the success of your leadership',
                ],
              },
            ],
          },
        ],
      },
    };
  }

  async getTopic(topicId) {
    // In a real application, this might fetch from an API
    // Here we're just returning the topic from our local data
    return this.topics[topicId];
  }
}
