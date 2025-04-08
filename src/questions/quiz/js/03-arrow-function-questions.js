const arrowFunctionQuestions = [
    {
      id: 'arrow1',
      question: 'What is the output of this code?\n<code>const getName = () => "Alice";\nconsole.log(getName());</code>',
      options: ['"Alice"', 'undefined', 'function', 'Error'],
      correctAnswer: 0,
      explanation: 
        "This arrow function implicitly returns the string \"Alice\" without needing a <code>return</code> keyword. When an arrow function has only one expression and no curly braces, the expression's result is automatically returned. This concise syntax is perfect for simple transformations and is widely used in array methods like <code>map</code> and <code>filter</code>.",
      category: 'Arrow Functions',
      difficulty: 'easy',
    },
    {
      id: 'arrow2',
      question: 'What\'s the difference between these two functions?\n<code>// Function 1\nconst getThis = function() {\n  return this;\n};\n\n// Function 2\nconst getThisArrow = () => this;</code>',
      options: [
        'No difference, they work exactly the same', 
        'Function 1 creates its own this binding, Function 2 inherits this from the surrounding scope', 
        'Function 2 creates its own this binding, Function 1 inherits this from the surrounding scope', 
        'Arrow functions cannot access this at all'
      ],
      correctAnswer: 1,
      explanation:
        "One of the most important differences between regular and arrow functions is how they handle <code>this</code>. Regular functions create their own <code>this</code> binding based on how they're called. Arrow functions don't have their own <code>this</code> - they inherit it from the parent scope (lexical <code>this</code>). This makes arrow functions ideal for callbacks within methods where you want to preserve the outer <code>this</code> context, eliminating the need for <code>var self = this</code> or <code>.bind(this)</code> patterns.",
      category: 'Arrow Functions',
      difficulty: 'medium',
    },
    {
      id: 'arrow3',
      question: 'What is the output of this code?\n<code>const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);</code>',
      options: [
        '[1, 2, 3, 4, 5]', 
        '[2, 4, 6, 8, 10]', 
        '[undefined, undefined, undefined, undefined, undefined]', 
        'TypeError'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates a common use case for arrow functions - as concise callbacks for array methods. The <code>map</code> method creates a new array by applying the function to each element. The arrow function <code>num => num * 2</code> doubles each number, resulting in <code>[2, 4, 6, 8, 10]</code>. This syntax is much cleaner than the equivalent function expression: <code>function(num) { return num * 2; }</code>. Arrow functions shine in these single-expression scenarios.",
      category: 'Arrow Functions',
      difficulty: 'easy',
    },
    {
      id: 'arrow4',
      question: 'What is the output of this code?\n<code>const person = {\n  name: "Alice",\n  friends: ["Bob", "Charlie"],\n  printFriends() {\n    this.friends.forEach(friend => {\n      console.log(this.name + " knows " + friend);\n    });\n  }\n};\nperson.printFriends();</code>',
      options: [
        '"undefined knows Bob", "undefined knows Charlie"', 
        '"Alice knows Bob", "Alice knows Charlie"', 
        'TypeError: Cannot read property \'name\' of undefined', 
        'Nothing, the code has a syntax error'
      ],
      correctAnswer: 1,
      explanation:
        "This showcases a key benefit of arrow functions - they inherit <code>this</code> from their surrounding scope. Inside the <code>forEach</code> callback, <code>this</code> still refers to the <code>person</code> object, so <code>this.name</code> correctly accesses \"Alice\". If a regular function were used instead, <code>this</code> would refer to the global object (or be undefined in strict mode), causing errors or unexpected behavior. This pattern is extremely common in React components and event handlers where preserving the correct <code>this</code> context is crucial.",
      category: 'Arrow Functions',
      difficulty: 'medium',
    },
    {
      id: 'arrow5',
      question: 'Which of these is NOT a valid arrow function syntax?',
      options: [
        'const add = (a, b) => a + b;', 
        'const greet = name => `Hello ${name}`;', 
        'const getObject = () => ({ name: "Alice" });', 
        'const multiply = (a, b) => { a * b; }'
      ],
      correctAnswer: 3,
      explanation:
        "The function <code>multiply</code> has a body with curly braces but no <code>return</code> statement. When using curly braces with arrow functions, you must explicitly use the <code>return</code> keyword, otherwise the function returns <code>undefined</code>. The correct version would be <code>const multiply = (a, b) => { return a * b; }</code> or the implicit return version <code>const multiply = (a, b) => a * b;</code>. This is a common mistake when transitioning between the concise and block body syntax of arrow functions.",
      category: 'Arrow Functions',
      difficulty: 'medium',
    },
    {
      id: 'arrow6',
      question: 'What is the output of this code?\n<code>const counter = {\n  count: 0,\n  increment: () => {\n    this.count++;\n    return this.count;\n  }\n};\nconsole.log(counter.increment());</code>',
      options: ['1', '0', 'NaN', 'undefined'],
      correctAnswer: 3,
      explanation:
        "This demonstrates a common pitfall with arrow functions. Since arrow functions inherit <code>this</code> from the surrounding scope (lexical <code>this</code>), <code>this</code> inside the <code>increment</code> method doesn't refer to the <code>counter</code> object - it refers to the outer scope (likely the global object or module). <code>this.count</code> is therefore <code>undefined</code>, and <code>undefined++</code> evaluates to <code>NaN</code>, but the function returns <code>undefined</code> because <code>NaN</code> isn't assigned back to anything. For object methods where you need to access the object via <code>this</code>, regular function syntax is usually more appropriate.",
      category: 'Arrow Functions',
      difficulty: 'hard',
    },
    {
      id: 'arrow7',
      question: 'How would you write an arrow function that takes a single parameter and returns an object with a property matching that parameter?',
      options: [
        'param => { key: param }', 
        'param => ({ key: param })', 
        'param => { return key: param }', 
        'param => return { key: param }'
      ],
      correctAnswer: 1,
      explanation:
        "When returning an object literal directly from an arrow function, you must wrap it in parentheses: <code>param => ({ key: param })</code>. Without parentheses, JavaScript interprets the curly braces as the function body rather than an object literal, leading to a syntax error. This pattern is frequently used in React when returning JSX from arrow functions and in Redux reducers when creating new state objects. It's a small syntax detail that causes many bugs for developers new to arrow functions.",
      category: 'Arrow Functions',
      difficulty: 'medium',
    },
    {
      id: 'arrow8',
      question: 'What is the output of this code?\n<code>const numbers = [5, 10, 15, 20];\nconst result = numbers.reduce((total, num) => total + num, 0);\nconsole.log(result);</code>',
      options: ['0', '5', '50', '[5, 10, 15, 20]'],
      correctAnswer: 2,
      explanation:
        "This demonstrates using arrow functions with the powerful <code>reduce</code> method. The arrow function <code>(total, num) => total + num</code> adds each number to the accumulator, starting with an initial value of 0. The calculation is: 0+5+10+15+20=50. Arrow functions are ideal for these short callback scenarios, making the code more readable. The <code>reduce</code> method is extremely versatile and can be used for summing values, building objects, flattening arrays, and many other transformations.",
      category: 'Arrow Functions',
      difficulty: 'medium',
    },
    {
      id: 'arrow9',
      question: 'What feature of JavaScript do arrow functions NOT support?',
      options: [
        'Default parameters', 
        'Rest parameters', 
        'The arguments object', 
        'Destructuring parameters'
      ],
      correctAnswer: 2,
      explanation:
        "Arrow functions don't have their own <code>arguments</code> object, unlike regular functions. If you need to access all arguments passed to an arrow function, use rest parameters instead: <code>(...args) => { console.log(args); }</code>. Arrow functions do support other modern features like default parameters <code>(x = 1) => x + 1</code>, rest parameters <code>(...nums) => nums.sum()</code>, and destructuring <code>({name}) => name</code>. Understanding these limitations helps you choose the right function syntax for each situation.",
      category: 'Arrow Functions',
      difficulty: 'hard',
    },
    {
      id: 'arrow10',
      question: 'What is the output of this code?\n<code>const ten = _ => 10;\nconst five = () => 5;\nconsole.log(ten() + five());</code>',
      options: ['15', '105', 'NaN', 'Error'],
      correctAnswer: 0,
      explanation:
        "This demonstrates two ways to define arrow functions with no parameters. Both <code>_ => 10</code> and <code>() => 5</code> are valid syntax. The underscore is just a parameter name (by convention often used for unused parameters), while empty parentheses explicitly indicate no parameters. Both functions return their respective values, so the output is 10+5=15. While both syntaxes work, using <code>()</code> for no-parameter functions is generally considered more readable and is the more common convention in modern JavaScript.",
      category: 'Arrow Functions',
      difficulty: 'easy',
    },
    {
      id: 'arrow11',
      question: 'What is the advantage of using arrow functions for class properties in this React component?\n<code>class Counter extends React.Component {\n  state = { count: 0 };\n\n  // Method A\n  increment = () => {\n    this.setState({ count: this.state.count + 1 });\n  }\n\n  // Method B\n  decrement() {\n    this.setState({ count: this.state.count - 1 });\n  }\n\n  render() {\n    return (\n      <div>\n        <p>{this.state.count}</p>\n        <button onClick={this.increment}>+</button>\n        <button onClick={this.decrement}>-</button>\n      </div>\n    );\n  }\n}</code>',
      options: [
        'Arrow functions are just syntactic sugar; there\'s no practical difference',
        'Arrow function properties automatically bind "this" to the class instance',
        'Arrow functions are faster and more memory efficient',
        'Arrow functions enable the ES6 class property syntax'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates a crucial practical use of arrow functions in class-based React components. The arrow function property <code>increment</code> automatically binds <code>this</code> to the class instance, while the regular method <code>decrement</code> loses its <code>this</code> binding when passed as a callback. When the decrement button is clicked, it will cause a <code>TypeError: Cannot read property 'setState' of undefined</code> because <code>this</code> becomes <code>undefined</code> in strict mode. To fix it, you'd need to manually bind in the constructor (<code>this.decrement = this.decrement.bind(this)</code>) or use an arrow function. This pattern is so common in React that using arrow functions for event handlers became a best practice before hooks were introduced.",
      category: 'Arrow Functions',
      difficulty: 'hard',
    },
    {
      id: 'js5',
      question:
        'What is the output of the following code?\n<pre><code>let x = 10;\nfunction foo() {\n  console.log(x);\n  let x = 20;\n}\nfoo();</code></pre>',
      options: ['10', '20', 'undefined', 'ReferenceError'],
      correctAnswer: 3,
      explanation:
        "This code will throw a ReferenceError. Due to the 'temporal dead zone', the variable x inside the function exists but cannot be accessed before its declaration. Even though there's an x in the global scope, the local x shadows it.",
      category: 'Scope and Hoisting',
      difficulty: 'medium',
    },
  ];
  
  export default arrowFunctionQuestions;
