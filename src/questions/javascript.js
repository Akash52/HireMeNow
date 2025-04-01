export const questions = [
    {
      id: "js1",
      question: "What is the output of <code>console.log(typeof null)</code>?",
      options: ["null", "object", "undefined", "number"],
      correctAnswer: 1,
      explanation: "In JavaScript, <code>typeof null</code> returns 'object', which is considered a bug in the language. It was supposed to return 'null', but this behavior has been maintained for backward compatibility.",
      category: "JavaScript Basics",
      difficulty: "easy"
    },
    {
      id: "js2",
      question: "Which method is used to add one or more elements to the end of an array and returns the new length of the array?",
      options: ["push()", "pop()", "concat()", "join()"],
      correctAnswer: 0,
      explanation: "The <code>push()</code> method adds one or more elements to the end of an array and returns the new length of the array.",
      category: "Arrays",
      difficulty: "easy"
    },
    {
      id: "js3",
      question: "What does the <code>===</code> operator do?",
      options: [
        "Checks for equality of value only",
        "Checks for equality of value and type",
        "Assigns a value to a variable",
        "Checks if a value is truthy"
      ],
      correctAnswer: 1,
      explanation: "The strict equality operator (<code>===</code>) checks if two values have the same value and the same type. For example, <code>'5' === 5</code> is false because one is a string and the other is a number.",
      category: "Operators",
      difficulty: "easy"
    },
    {
      id: "js4",
      question: "What is closure in JavaScript?",
      options: [
        "A way to protect variables from being accessed",
        "A function that has access to variables in its outer lexical environment",
        "A method to close browser windows",
        "A way to end JavaScript execution"
      ],
      correctAnswer: 1,
      explanation: "A closure is a function that has access to variables in its outer (enclosing) lexical environment, even after the outer function has returned. This allows for data encapsulation and the creation of private variables.",
      category: "Functions",
      difficulty: "medium"
    },
    {
      id: "js5",
      question: "What is the output of the following code?\n<pre><code>let x = 10;\nfunction foo() {\n  console.log(x);\n  let x = 20;\n}\nfoo();</code></pre>",
      options: [
        "10",
        "20",
        "undefined",
        "ReferenceError"
      ],
      correctAnswer: 3,
      explanation: "This code will throw a ReferenceError. Due to the 'temporal dead zone', the variable x inside the function exists but cannot be accessed before its declaration. Even though there's an x in the global scope, the local x shadows it.",
      category: "Scope and Hoisting",
      difficulty: "medium"
    },
    {
      id: "js6",
      question: "What is the event loop in JavaScript?",
      options: [
        "A design pattern for handling UI events",
        "A mechanism that allows JavaScript to perform non-blocking operations",
        "A loop that iterates through all DOM events",
        "A special type of for loop"
      ],
      correctAnswer: 1,
      explanation: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It handles executing code, collecting and processing events, and executing queued sub-tasks.",
      category: "Asynchronous JavaScript",
      difficulty: "medium"
    },
    {
      id: "js7",
      question: "What will be the output of the following code?\n<pre><code>console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);</code></pre>",
      options: [
        "1, 2, 3, 4",
        "1, 4, 3, 2",
        "1, 4, 2, 3",
        "4, 3, 2, 1"
      ],
      correctAnswer: 1,
      explanation: "The output will be 1, 4, 3, 2. First, synchronous code executes (1, 4). Then, microtasks like Promises are processed (3). Finally, macrotasks like setTimeout callbacks are executed (2), even with a delay of 0ms.",
      category: "Asynchronous JavaScript",
      difficulty: "hard"
    },
    {
      id: "js8",
      question: "What is the purpose of the <code>bind()</code> method in JavaScript?",
      options: [
        "To create a new array with the results of calling a function on every element",
        "To attach an event handler to an element",
        "To create a new function with a specified 'this' value and initial arguments",
        "To join all elements of an array into a string"
      ],
      correctAnswer: 2,
      explanation: "The <code>bind()</code> method creates a new function that, when called, has its 'this' keyword set to a specific value, with a given sequence of arguments preceding any provided when the new function is called.",
      category: "Functions",
      difficulty: "medium"
    },
    {
      id: "js9",
      question: "What is a Promise in JavaScript?",
      options: [
        "A guarantee that a function will execute successfully",
        "An object representing the eventual completion or failure of an asynchronous operation",
        "A special type of callback function",
        "A way to promise code will run in the future"
      ],
      correctAnswer: 1,
      explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It allows you to associate handlers with an asynchronous action's eventual success or failure.",
      category: "Asynchronous JavaScript",
      difficulty: "medium"
    },
    {
      id: "js10",
      question: "What is the output of <code>console.log(0.1 + 0.2 === 0.3)</code>?",
      options: [
        "true",
        "false",
        "undefined",
        "Error"
      ],
      correctAnswer: 1,
      explanation: "The output is false. Due to how floating-point numbers are represented in binary, 0.1 + 0.2 actually equals 0.30000000000000004, not exactly 0.3.",
      category: "JavaScript Basics",
      difficulty: "easy"
    },
    {
      id: "js11",
      question: "What is the purpose of the <code>use strict</code> directive?",
      options: [
        "To enforce stricter parsing and error handling in JavaScript",
        "To make JavaScript code run faster",
        "To enable new JavaScript features",
        "To prevent the use of global variables"
      ],
      correctAnswer: 0,
      explanation: "The 'use strict' directive enables strict mode in JavaScript, which enforces stricter parsing and error handling. It helps catch common coding mistakes and 'unsafe' actions, prevents the use of certain syntax, and more.",
      category: "JavaScript Basics",
      difficulty: "medium"
    },
    {
      id: "js12",
      question: "What is the difference between <code>let</code>, <code>const</code>, and <code>var</code>?",
      options: [
        "They are all identical ways to declare variables",
        "let and const are block-scoped, while var is function-scoped",
        "const and var are block-scoped, while let is function-scoped",
        "let and var can be reassigned, while const is for constants only"
      ],
      correctAnswer: 1,
      explanation: "let and const are block-scoped (only accessible within the block they're defined in), while var is function-scoped. Additionally, const variables cannot be reassigned after declaration, while let and var can be.",
      category: "Variables",
      difficulty: "easy"
    },
    {
      id: "js13",
      question: "What is the purpose of the <code>Map</code> object in JavaScript?",
      options: [
        "To transform elements in an array",
        "To store key-value pairs and remember the original insertion order of the keys",
        "To create a visual map on a webpage",
        "To map one function to another function"
      ],
      correctAnswer: 1,
      explanation: "The Map object in JavaScript is a collection of key-value pairs where both the keys and values can be of any type. It remembers the original insertion order of the keys and offers better performance for frequent additions and removals compared to objects.",
      category: "Data Structures",
      difficulty: "medium"
    },
    {
      id: "js14",
      question: "What is a generator function in JavaScript?",
      options: [
        "A function that generates random numbers",
        "A function that creates other functions",
        "A function that can be paused and resumed, yielding multiple values",
        "A function that automatically generates documentation"
      ],
      correctAnswer: 2,
      explanation: "A generator function is a special type of function that can be paused and resumed, allowing it to yield multiple values. It's defined using an asterisk (*) and uses the yield keyword to pause and return values.",
      category: "Functions",
      difficulty: "hard"
    },
    {
      id: "js15",
      question: "What is the purpose of the <code>Symbol</code> type in JavaScript?",
      options: [
        "To create unique identifiers",
        "To represent mathematical symbols",
        "To encrypt sensitive data",
        "To create special characters in strings"
      ],
      correctAnswer: 0,
      explanation: "The Symbol type in JavaScript is used to create unique identifiers. Every Symbol value is unique and immutable, making them ideal for object property keys when you want to avoid name collisions.",
      category: "Data Types",
      difficulty: "hard"
    }
  ];
  
  