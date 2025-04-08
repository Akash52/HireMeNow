const functionQuestions = [
    {
      id: 'fn1',
      question: 'What is the output of this code?\n<code>function mystery(a, b) {\n  return a + b;\n}\nconst result = mystery(3, 4);\nconsole.log(typeof result);</code>',
      options: ['string', 'number', 'function', 'undefined'],
      correctAnswer: 1,
      explanation: 
        "This function adds two numbers together, returning 7. The <code>typeof</code> operator reveals the type of the returned value, which is 'number'. Understanding return types is crucial for debugging and type-checking in JavaScript applications.",
      category: 'JavaScript Functions',
      difficulty: 'easy',
    },
    {
      id: 'fn2',
      question: 'What happens when you call a function with fewer arguments than parameters?',
      options: [
        'JavaScript throws an error', 
        'The missing parameters get the value null', 
        'The missing parameters get the value undefined', 
        'The function automatically returns undefined'
      ],
      correctAnswer: 2,
      explanation:
        "JavaScript is forgiving with function arguments. If you call a function with fewer arguments than defined parameters, the missing parameters are automatically assigned <code>undefined</code>. This is why it's often good practice to provide default values for parameters that might be omitted: <code>function greet(name = 'friend') {...}</code>",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn3',
      question: 'What is the output of this code?\n<code>function counter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst increment = counter();\nconsole.log(increment());\nconsole.log(increment());</code>',
      options: ['0, 0', '1, 1', '1, 2', 'undefined, undefined'],
      correctAnswer: 2,
      explanation:
        "This demonstrates a closure - one of JavaScript's most powerful features. The inner function maintains access to the <code>count</code> variable even after <code>counter()</code> has finished executing. Each call to <code>increment()</code> increases and returns the enclosed <code>count</code> variable, outputting 1, then 2. Closures are essential for data encapsulation and creating private variables in JavaScript.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn4',
      question: 'What\'s the difference between these two function declarations?\n<code>// Version 1\nfunction multiply(a, b) {\n  return a * b;\n}\n\n// Version 2\nconst multiply = function(a, b) {\n  return a * b;\n};</code>',
      options: [
        'No difference, they work exactly the same', 
        'Version 1 is hoisted, Version 2 is not', 
        'Version 2 is faster than Version 1', 
        'Version 1 cannot be reassigned, Version 2 can be'
      ],
      correctAnswer: 1,
      explanation:
        "The key difference is hoisting. Function declarations (Version 1) are fully hoisted - they can be called before they appear in the code. Function expressions (Version 2) are not hoisted in the same way - the variable is hoisted but not its assignment, so calling it before the definition would result in a 'not a function' error. Understanding hoisting helps prevent subtle bugs in your code organization.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn5',
      question: 'What is the output of this code?\n<code>function outer() {\n  const x = 10;\n  function inner() {\n    console.log(x);\n  }\n  return inner;\n}\nconst closureFn = outer();\nclosureFn();</code>',
      options: ['undefined', '10', 'ReferenceError', 'null'],
      correctAnswer: 1,
      explanation:
        "This is another example of a closure. The <code>inner</code> function 'closes over' the variable <code>x</code> from its parent scope. When <code>outer()</code> is called, it returns the <code>inner</code> function, which still has access to <code>x</code> even though <code>outer</code> has finished executing. When <code>closureFn()</code> is called, it logs 10. Closures are used extensively in JavaScript for data privacy, factory functions, and maintaining state in functional programming.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn6',
      question: 'What is the output of this code?\n<code>const calculator = {\n  value: 0,\n  add: function(n) {\n    this.value += n;\n    return this;\n  },\n  multiply: function(n) {\n    this.value *= n;\n    return this;\n  },\n  getValue: function() {\n    return this.value;\n  }\n};\n\nconsole.log(calculator.add(5).multiply(2).getValue());</code>',
      options: ['5', '7', '10', '0'],
      correctAnswer: 2,
      explanation:
        "This demonstrates method chaining, a powerful pattern in JavaScript. Each method returns <code>this</code> (the object itself), allowing further method calls on the result. The calculation flows: start with 0, add 5 (value becomes 5), multiply by 2 (value becomes 10), then get the final value (10). Method chaining creates more readable code by avoiding repetitive object references and is commonly used in jQuery, lodash, and many modern JavaScript libraries.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn7',
      question: 'What is the output of this code?\n<code>function makeAdder(x) {\n  return function(y) {\n    return x + y;\n  };\n}\n\nconst add5 = makeAdder(5);\nconst add10 = makeAdder(10);\nconsole.log(add5(3) + add10(3));</code>',
      options: ['8', '13', '18', '21'],
      correctAnswer: 3,
      explanation:
        "This demonstrates a function factory using closures. <code>makeAdder</code> creates specialized functions that remember the value of <code>x</code>. <code>add5</code> is a function where <code>x</code> is permanently set to 5, and <code>add10</code> has <code>x</code> set to 10. When called with argument 3, they return 8 and 13 respectively, summing to 21. This pattern is powerful for creating families of functions with pre-configured behavior, commonly used in functional programming and for creating specialized event handlers.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn8',
      question: 'What is the output of this code?\n<code>const person = {\n  name: "Alice",\n  greet: function() {\n    return `Hello, I'm ${this.name}`;\n  }\n};\n\nconst greetFn = person.greet;\nconsole.log(greetFn());</code>',
      options: [
        'Hello, I\'m Alice', 
        'Hello, I\'m undefined', 
        'TypeError', 
        'Hello, I\'m '
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates how <code>this</code> binding works in JavaScript. When <code>greetFn</code> is assigned the function reference (without calling it), the function loses its connection to the <code>person</code> object. When later called as a standalone function, <code>this</code> refers to the global object (or undefined in strict mode), not to <code>person</code>. To preserve the context, you could use <code>bind()</code>: <code>const greetFn = person.greet.bind(person);</code> or arrow functions which don't have their own <code>this</code> binding.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn9',
      question: 'What is the output of this code?\n<code>function sum(...numbers) {\n  return numbers.reduce((total, num) => total + num, 0);\n}\n\nconsole.log(sum(1, 2, 3, 4, 5));</code>',
      options: ['0', '15', '[1,2,3,4,5]', 'Error'],
      correctAnswer: 1,
      explanation:
        "This demonstrates the rest parameter syntax (<code>...numbers</code>), which collects all arguments into an array. Combined with <code>reduce()</code>, this creates a flexible function that can sum any number of arguments. The output is 15 (1+2+3+4+5). Rest parameters provide a cleaner alternative to the arguments object and work well with array methods. This pattern is extremely useful for creating variadic functions (functions that accept a variable number of arguments) in a clean, readable way.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn10',
      question: 'What is the output of this code?\n<code>const multiply = (a, b = 1) => a * b;\n\nconsole.log(multiply(5));\nconsole.log(multiply(5, undefined));\nconsole.log(multiply(5, 2));</code>',
      options: [
        '5, 5, 10', 
        '5, undefined, 10', 
        'NaN, NaN, 10', 
        'Error'
      ],
      correctAnswer: 0,
      explanation:
        "This demonstrates default parameters in ES6+ functions. If <code>b</code> is not provided or is explicitly <code>undefined</code>, it defaults to 1. The outputs are: 5×1=5, 5×1=5 (because undefined triggers the default), and 5×2=10. Default parameters simplify function definitions by reducing the need for manual parameter checking. They're particularly useful for configuration objects where only some properties need to be overridden. Note that null, false, 0, or '' would not trigger the default value - only undefined or omitted parameters do.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    }
  ];
  
  export default functionQuestions;
  