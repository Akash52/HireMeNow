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
      question: 'What is the output of this code?\n<code>const person = {\n  name: "Alice",\n  greet: function() {\n    return `Hello, I\'m ${this.name}`;\n  }\n};\n\nconst greetFn = person.greet;\nconsole.log(greetFn());</code>',
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
    },
    {
      id: 'fn11',
      question: 'What is the output of this code?\n<code>const obj = {\n  name: "Object",\n  regularFn: function() {\n    return this.name;\n  },\n  arrowFn: () => {\n    return this.name;\n  }\n};\n\nconsole.log(obj.regularFn());\nconsole.log(obj.arrowFn());</code>',
      options: [
        '"Object", "Object"', 
        '"Object", undefined', 
        'undefined, "Object"', 
        'undefined, undefined'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates the difference in <code>this</code> binding between regular functions and arrow functions. Regular functions have their own <code>this</code> context that depends on how they're called. When called as a method, <code>this</code> refers to the object. Arrow functions, however, don't have their own <code>this</code> - they inherit it from the surrounding scope (lexical <code>this</code>). In the global scope, <code>this.name</code> is undefined. This distinction is crucial for event handlers and callback functions.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn12',
      question: 'What is the output of this recursive factorial function?\n<code>function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5));</code>',
      options: ['5', '15', '25', '120'],
      correctAnswer: 3,
      explanation:
        "This demonstrates recursion, where a function calls itself until a base case is reached. The factorial of 5 is calculated as 5 * 4 * 3 * 2 * 1 = 120. Recursion is powerful for problems that can be broken down into smaller, similar sub-problems. However, be cautious with recursion in JavaScript as it can cause stack overflow errors for deep recursion. For production code with large inputs, consider alternatives like iteration or tail-call optimization.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn13',
      question: 'What will this generator function output?\n<code>function* countUp() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n\nconst counter = countUp();\nconsole.log(counter.next().value);\nconsole.log(counter.next().value);\nconsole.log(counter.next().value);\nconsole.log(counter.next().value);</code>',
      options: ['1, 2, 3, 4', '1, 2, 3, undefined', '1, 1, 1, 1', 'undefined, undefined, undefined, undefined'],
      correctAnswer: 1,
      explanation:
        "This demonstrates generator functions, introduced in ES6. The <code>function*</code> syntax and <code>yield</code> keyword allow functions to pause and resume execution. Each call to <code>next()</code> returns an object with <code>value</code> (the yielded value) and <code>done</code> (boolean indicating if the generator is complete). The outputs are 1, 2, 3, and undefined (after the generator is exhausted). Generators are valuable for creating iterators, processing streams of data, and managing asynchronous flows without deep callback nesting.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn14',
      question: 'What is the output of this code using the Function constructor?\n<code>const dynamicFn = new Function(\'a\', \'b\', \'return a + b\');\nconsole.log(dynamicFn(5, 7));</code>',
      options: ['12', '"57"', 'Error', 'undefined'],
      correctAnswer: 0,
      explanation:
        "This demonstrates JavaScript's <code>Function</code> constructor, which creates functions dynamically at runtime. The last argument is the function body, while previous arguments define parameter names. This code creates a function equivalent to <code>(a, b) => a + b</code> and returns 12. While powerful, the Function constructor executes code in the global scope and presents security risks if used with unsanitized inputs (similar to eval()). It's rarely needed in modern code but can be useful for template engines or dynamic code generation in controlled environments.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn15',
      question: 'What is the output of this async function?\n<code>async function example() {\n  return "Hello";\n}\n\nconsole.log(example());</code>',
      options: ['Hello', 'undefined', 'Promise {<resolved>: "Hello"}', 'Promise {<pending>}'],
      correctAnswer: 3,
      explanation:
        "This demonstrates the behavior of async functions. Even when returning a non-promise value like \"Hello\", an async function automatically wraps it in a Promise. The console.log shows a pending Promise because the function returns immediately while the Promise is resolving. To access the actual value, you would use: <code>example().then(console.log)</code> or <code>await example()</code> (inside another async function). Understanding this behavior is essential for asynchronous programming with modern JavaScript.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
     {
      id: 'fn16',
      question: 'What will this code output?\n<code>function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (!(key in cache)) {\n      cache[key] = fn(...args);\n    }\n    return cache[key];\n  }\n}\n\nlet computeCount = 0;\nconst heavyComputation = (n) => {\n  computeCount++;\n  return n * 2;\n};\n\nconst memoized = memoize(heavyComputation);\nconsole.log(memoized(5));\nconsole.log(memoized(5));\nconsole.log(computeCount);</code>',
      options: ['10, 10, 1', '10, 10, 2', '10, undefined, 1', '5, 5, 2'],
      correctAnswer: 0,
      explanation: 
        "This demonstrates function memoization, an optimization technique that caches function results based on input parameters. When <code>memoized(5)</code> is called the first time, it computes and caches the result. The second call retrieves from cache without re-computing. This is why <code>computeCount</code> is 1, not 2. Memoization is incredibly useful for expensive calculations, API calls, or recursive functions like Fibonacci. It offers substantial performance improvements at the cost of memory usage.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn17',
      question: 'What does this function composition code output?\n<code>const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);\n\nconst addOne = x => x + 1;\nconst double = x => x * 2;\nconst square = x => x * x;\n\nconst enhance = compose(square, double, addOne);\nconsole.log(enhance(3));</code>',
      options: ['64', '49', '56', '36'],
      correctAnswer: 0,
      explanation:
        "This demonstrates function composition, a core concept in functional programming. The <code>compose</code> function takes multiple functions and returns a new function that passes its input through each function from right to left. With input 3, the calculation flows: addOne(3) → 4, double(4) → 8, square(8) → 64. Function composition enables building complex operations from simple ones, improving code modularity and readability. It's widely used in Redux, React's higher-order components, and functional libraries like Ramda or lodash/fp.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn18',
      question: 'What will this code using Symbol.toPrimitive output?\n<code>function createCounter() {\n  let count = 0;\n  return {\n    increment() { count++; return this; },\n    decrement() { count--; return this; },\n    [Symbol.toPrimitive](hint) {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\ncounter.increment().increment().increment();\nconsole.log(counter + 5);</code>',
      options: ['[object Object]5', '8', 'NaN', '3 + 5'],
      correctAnswer: 1,
      explanation:
        "This demonstrates <code>Symbol.toPrimitive</code>, a powerful method that controls how objects are converted to primitive values. When the counter is used in a mathematical operation (<code>counter + 5</code>), JavaScript calls the <code>Symbol.toPrimitive</code> method, which returns the current count (3). Adding 5 results in 8. This technique enables objects to behave like numbers or strings in expressions while maintaining their methods. It's useful for creating DSLs (domain-specific languages) and fluent interfaces in financial calculations, unit conversions, or custom data types.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn19',
      question: 'What is the output of this debounce implementation?\n<code>function debounce(fn, delay) {\n  let timer = null;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\nlet callCount = 0;\nfunction increment() { callCount++; }\n\nconst debouncedIncrement = debounce(increment, 100);\n\n// Simulating rapid calls\ndebouncedIncrement();\ndebouncedIncrement();\ndebouncedIncrement();\n\n// Check immediately\nconsole.log("Immediate count:", callCount);\n\n// Check after delay (pseudo-code for timing)\n// setTimeout(() => console.log("Delayed count:", callCount), 200);</code>',
      options: ['Immediate count: 3', 'Immediate count: 1', 'Immediate count: 0', 'Error: this is undefined'],
      correctAnswer: 2,
      explanation:
        "This demonstrates debouncing, a technique to limit how often a function executes during rapid calls. The debounced function postpones execution until a pause in calls occurs. In this case, <code>callCount</code> remains 0 immediately after the calls because the timeout hasn't elapsed yet. If we checked after the delay (as in the commented code), it would be 1 since multiple rapid calls result in just one execution. Debouncing is essential for performance in UI development - for search inputs, window resizing, scroll events, and API requests. It prevents unnecessary processing when events fire rapidly.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn20',
      question: 'What is the output of this code using the Proxy object?\n<code>function createSafeObject(target) {\n  return new Proxy(target, {\n    get(obj, prop) {\n      if (prop in obj) {\n        return obj[prop];\n      } else {\n        return `Property "${prop}" does not exist`;\n      }\n    }\n  });\n}\n\nconst user = createSafeObject({ name: "Alice", role: "Admin" });\nconsole.log(user.name);\nconsole.log(user.age);</code>',
      options: ['Alice, undefined', 'Alice, null', 'Alice, Property "age" does not exist', 'Error'],
      correctAnswer: 2,
      explanation:
        "This demonstrates JavaScript's <code>Proxy</code> object, which wraps another object to intercept and redefine operations. Here, our proxy intercepts property access with a custom <code>get</code> handler that returns a helpful message instead of <code>undefined</code> for missing properties. This pattern is powerful for creating \"null-safe\" objects, validation layers, logging, and implementing observable data. Proxies enable metaprogramming techniques used in modern frameworks like Vue.js for reactivity systems and form validation libraries.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn21',
      question: 'What will this curried function output?\n<code>function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    } else {\n      return function(...args2) {\n        return curried.apply(this, args.concat(args2));\n      };\n    }\n  };\n}\n\nconst sum = (a, b, c) => a + b + c;\nconst curriedSum = curry(sum);\n\nconsole.log(curriedSum(1)(2)(3));\nconsole.log(curriedSum(1, 2)(3));\nconsole.log(curriedSum(1)(2, 3));</code>',
      options: ['6, 6, 6', 'Error, 6, 6', '6, Error, Error', 'undefined, undefined, 6'],
      correctAnswer: 0,
      explanation:
        "This demonstrates currying, a functional programming technique where a function with multiple arguments is transformed into a sequence of functions that each take a single argument. Our <code>curry</code> implementation is flexible, allowing partial application with any number of arguments at each step. All three calls produce 6 but in different ways: one argument at a time, two then one, and one then two. Currying enables function specialization, creates cleaner point-free code, and simplifies function composition. It's widely used in functional libraries and for creating reusable, specialized functions from more general ones.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn22',
      question: 'What does this throttle function implementation output?\n<code>function throttle(fn, limit) {\n  let inThrottle = false;\n  return function(...args) {\n    if (!inThrottle) {\n      fn.apply(this, args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n\nlet count = 0;\nconst increment = () => { count++; };\nconst throttledIncrement = throttle(increment, 100);\n\n// Call 5 times rapidly\nthrottledIncrement();\nthrottledIncrement();\nthrottledIncrement();\nthrottledIncrement();\nthrottledIncrement();\n\nconsole.log(count);</code>',
      options: ['5', '1', '0', 'Depends on timing'],
      correctAnswer: 1,
      explanation:
        "This demonstrates throttling, a technique to limit how often a function can execute. Unlike debouncing (which postpones execution), throttling ensures a function runs at most once per specified time interval. After the first call executes, subsequent calls within the cooldown period are ignored. Here, only the first increment runs, so <code>count</code> is 1. Throttling is crucial for performance with continuous events like scrolling, dragging, or mousemove, and for rate-limiting API calls. It allows some executions to happen (unlike debounce) while still protecting resources from excessive calls.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn23',
      question: 'What will this code using a generator and async/await output?\n<code>function* range(start, end) {\n  for(let i = start; i <= end; i++) {\n    yield i;\n  }\n}\n\nasync function processSequentially(generator) {\n  let result = 0;\n  for (const num of generator) {\n    // Simulate async operation\n    await new Promise(resolve => setTimeout(resolve, 10));\n    result += num;\n  }\n  return result;\n}\n\n// Usage:\nconst myRange = range(1, 3);\nprocessSequentially(myRange).then(sum => console.log("Sum:", sum));\nconsole.log("Started");</code>',
      options: [
        'Sum: 6, Started', 
        'Started, Sum: 6', 
        'Started (and Sum: 6 after a delay)', 
        'Error: generators cannot be used with async/await'
      ],
      correctAnswer: 2,
      explanation:
        "This demonstrates combining generators with async/await for controlled asynchronous iteration. The generator creates a sequence (1,2,3), which the async function processes with a simulated delay. Console logs 'Started' immediately, while 'Sum: 6' appears after all promises resolve. This pattern is powerful for processing data streams, paginated API responses, or large datasets without blocking the main thread. It offers fine-grained control over asynchronous sequences, allowing pausing, resuming, and error handling while maintaining readable sequential code structure.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'fn24',
      question: 'What will this function using the call and apply methods output?\n<code>function greet(greeting, punctuation) {\n  return `${greeting}, ${this.name}${punctuation}`;\n}\n\nconst person1 = { name: "Alice" };\nconst person2 = { name: "Bob" };\n\nconst result1 = greet.call(person1, "Hello", "!");\nconst result2 = greet.apply(person2, ["Hi", "?"]);\n\nconsole.log(`${result1} ${result2}`);</code>',
      options: [
        'Hello, undefined! Hi, undefined?',
        'Hello, Alice! Hi, Bob?',
        'TypeError: Cannot read property \'name\' of undefined',
        'Hello, ! Hi, ?'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates <code>call</code> and <code>apply</code>, methods that explicitly set <code>this</code> for function execution. Both perform similar tasks but differ in argument passing: <code>call</code> accepts arguments individually while <code>apply</code> takes them as an array. The output combines 'Hello, Alice!' and 'Hi, Bob?' for 'Hello, Alice! Hi, Bob?'. These methods are essential for function borrowing (using methods from other objects), implementing inheritance patterns, and reusing functions in different contexts. Understanding the distinction helps write more flexible and reusable code, especially when working with DOM events or implementing method chaining.",
      category: 'JavaScript Functions',
      difficulty: 'medium',
    },
    {
      id: 'fn25',
      question: 'What will this code using decorators output?\n<code>function measureTime(originalFn) {\n  return function(...args) {\n    const start = performance.now();\n    const result = originalFn.apply(this, args);\n    const end = performance.now();\n    console.log(`Execution took ${end - start} ms`);\n    return result;\n  };\n}\n\nfunction retry(attempts) {\n  return function(originalFn) {\n    return function(...args) {\n      let lastError;\n      for (let i = 0; i < attempts; i++) {\n        try {\n          return originalFn.apply(this, args);\n        } catch (error) {\n          lastError = error;\n          console.log(`Attempt ${i+1} failed, retrying...`);\n        }\n      }\n      throw lastError;\n    };\n  };\n}\n\nconst isPrime = measureTime(\n  retry(3)(\n    function(n) {\n      if (n <= 1) return false;\n      if (n <= 3) return true;\n      if (n % 2 === 0 || n % 3 === 0) return false;\n      for (let i = 5; i * i <= n; i += 6) {\n        if (n % i === 0 || n % (i + 2) === 0) return false;\n      }\n      return true;\n    }\n  )\n);\n\nconst result = isPrime(9007199254740881); // Mersenne prime\nconsole.log("Is prime:", result);</code>',
      options: [
        'Is prime: true',
        'Is prime: false',
        'Multiple logs including execution time and "Is prime: true/false"',
        'Error: decorators are not supported in JavaScript'
      ],
      correctAnswer: 2,
      explanation:
        "This demonstrates function decorators, a powerful pattern for extending function behavior without modifying its core logic. Here, we stack multiple decorators: <code>measureTime</code> logs performance metrics and <code>retry</code> adds automatic retry logic on failure. The output includes execution time and the primality result. While not official decorators (as in TypeScript or the proposed JavaScript syntax), this functional approach achieves the same goal. Decorators follow the Single Responsibility Principle and are essential for cross-cutting concerns like logging, caching, authentication, and error handling without cluttering business logic.",
      category: 'JavaScript Functions',
      difficulty: 'hard',
    },
    {
      id: 'js4',
      question: 'What is closure in JavaScript?',
      options: [
        'A way to protect variables from being accessed',
        'A function that has access to variables in its outer lexical environment',
        'A method to close browser windows',
        'A way to end JavaScript execution',
      ],
      correctAnswer: 1,
      explanation:
        'A closure is a function that has access to variables in its outer (enclosing) lexical environment, even after the outer function has returned. This allows for data encapsulation and the creation of private variables.',
      category: 'Functions',
      difficulty: 'medium',
    },
    {
      id: 'js8',
      question: 'What is the purpose of the <code>bind()</code> method in JavaScript?',
      options: [
        'To create a new array with the results of calling a function on every element',
        'To attach an event handler to an element',
        "To create a new function with a specified 'this' value and initial arguments",
        'To join all elements of an array into a string',
      ],
      correctAnswer: 2,
      explanation:
        "The <code>bind()</code> method creates a new function that, when called, has its 'this' keyword set to a specific value, with a given sequence of arguments preceding any provided when the new function is called.",
      category: 'Functions',
      difficulty: 'medium',
    },
    {
      id: 'js14',
      question: 'What is a generator function in JavaScript?',
      options: [
        'A function that generates random numbers',
        'A function that creates other functions',
        'A function that can be paused and resumed, yielding multiple values',
        'A function that automatically generates documentation',
      ],
      correctAnswer: 2,
      explanation:
        "A generator function is a special type of function that can be paused and resumed, allowing it to yield multiple values. It's defined using an asterisk (*) and uses the yield keyword to pause and return values.",
      category: 'Functions',
      difficulty: 'hard',
    },
];

export default functionQuestions;
