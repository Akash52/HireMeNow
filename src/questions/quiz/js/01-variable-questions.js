const variableQuestions = [
    {
      id: 'var1',
      question: 'What is the output of the following code?\n<code>const greeting = "Hello";\ngreeting = "Hi";\nconsole.log(greeting);</code>',
      options: [
        '"Hello"', 
        '"Hi"', 
        'undefined', 
        'TypeError: Assignment to constant variable'
      ],
      correctAnswer: 3,
      explanation: 
        "Variables declared with <code>const</code> cannot be reassigned after initialization. This code throws a <code>TypeError: Assignment to constant variable</code>. This is why <code>const</code> is useful for values that shouldn't change, providing better code safety.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var2',
      question: 'Which variable declaration is following the recommended best practice?',
      options: [
        'var userName = "dev123";', 
        'let userName = "dev123";', 
        'const userName = "dev123";', 
        'userName = "dev123";'
      ],
      correctAnswer: 2,
      explanation:
        "Modern JavaScript best practices recommend using <code>const</code> by default for all variables that don't need to be reassigned. This prevents accidental reassignment and makes code more predictable. Use <code>let</code> only when you need to reassign a variable, and avoid <code>var</code> due to its function-scoping and hoisting behaviors.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var3',
      question: 'What is the output of this code?\n<code>let sum = 0;\nconst num1 = 300;\nconst num2 = 50;\nsum = num1 + num2;\nconsole.log(sum);</code>',
      options: ['0', '300', '350', 'Error'],
      correctAnswer: 2,
      explanation:
        "This code initializes <code>sum</code> as 0, then reassigns it to the result of <code>num1 + num2</code>, which is 300 + 50 = 350. This demonstrates how <code>let</code> variables can be reassigned, while the values stored in <code>const</code> variables remain fixed.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var4',
      question: 'Which of the following is NOT a valid variable name in JavaScript?',
      options: ['_privateVar', '$price', 'user-name', 'camelCase'],
      correctAnswer: 2,
      explanation:
        "In JavaScript, variable names cannot contain hyphens (-) as they're interpreted as the subtraction operator. Valid variable names can start with letters, underscore (_), or dollar sign ($), followed by letters, numbers, underscores, or dollar signs. <code>user-name</code> would be interpreted as <code>user minus name</code>.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var5',
      question: 'What is the value of <code>result</code> after this code runs?\n<code>const obj = {count: 1};\nconst result = obj;\nobj.count = 2;</code>',
      options: [
        '{count: 1}', 
        '{count: 2}', 
        'undefined', 
        'Error: Cannot modify a const variable'
      ],
      correctAnswer: 1,
      explanation:
        "While <code>const</code> prevents reassignment of the variable itself, it doesn't make the object immutable. The <code>obj</code> variable still references the same object, but the object's properties can be modified. After execution, both <code>obj</code> and <code>result</code> point to the same object with <code>count: 2</code>.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var6',
      question: 'What happens when you try to access a variable before it\'s declared with <code>let</code>?',
      options: [
        'It returns undefined', 
        'It throws a ReferenceError', 
        'It works fine if the variable is eventually declared', 
        'It returns null'
      ],
      correctAnswer: 1,
      explanation:
        "Variables declared with <code>let</code> and <code>const</code> are in the 'Temporal Dead Zone' from the start of the block until the declaration is processed. Accessing them during this time throws a <code>ReferenceError</code>. This differs from <code>var</code>, which would return <code>undefined</code> due to hoisting.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var7',
      question: 'Which statement about JavaScript variable declarations is TRUE?',
      options: [
        '<code>var</code> has block scope just like <code>let</code>', 
        '<code>const</code> variables cannot hold objects', 
        'You should use <code>var</code> for most variables in modern JavaScript', 
        '<code>let</code> allows reassignment while <code>const</code> doesn\'t'
      ],
      correctAnswer: 3,
      explanation:
        "The key difference between <code>let</code> and <code>const</code> is that <code>let</code> allows variable reassignment, while <code>const</code> doesn't. Both have block scope, unlike <code>var</code> which has function scope. <code>const</code> can hold objects (though the object's properties can still be modified), and modern best practice favors <code>const</code> by default, using <code>let</code> only when necessary.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var8',
      question: 'What is the output of this code?\n<code>const MAX_SIZE = 100;\nif (true) {\n  const MAX_SIZE = 200;\n  console.log(MAX_SIZE);\n}\nconsole.log(MAX_SIZE);</code>',
      options: ['100, 100', '200, 200', '200, 100', '100, 200'],
      correctAnswer: 2,
      explanation:
        "This demonstrates block scoping with <code>const</code>. Inside the if block, a new <code>MAX_SIZE</code> constant is declared with value 200, which shadows the outer <code>MAX_SIZE</code>. The first console.log outputs 200. After the block ends, the inner <code>MAX_SIZE</code> is no longer accessible, so the second console.log outputs the outer value, 100.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var9',
      question: 'Which naming convention is recommended for JavaScript variables?',
      options: [
        'snake_case (e.g., user_name)', 
        'PascalCase (e.g., UserName)', 
        'camelCase (e.g., userName)', 
        'kebab-case (e.g., user-name)'
      ],
      correctAnswer: 2,
      explanation:
        "In JavaScript, the conventional naming pattern for variables is camelCase, where the first word starts with a lowercase letter and subsequent words start with an uppercase letter. PascalCase is typically used for constructor functions and classes. snake_case is common in languages like Python, and kebab-case isn't valid for JavaScript variable names.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var10',
      question: 'What will this code output?\n<code>let counter = 1;\n{\n  let counter = 2;\n  {\n    let counter = 3;\n    console.log(counter);\n  }\n  console.log(counter);\n}\nconsole.log(counter);</code>',
      options: ['3, 2, 1', '1, 1, 1', '3, 3, 3', '1, 2, 3'],
      correctAnswer: 0,
      explanation:
        "This code demonstrates nested block scoping with <code>let</code>. Each block creates a new scope with its own <code>counter</code> variable that shadows the outer variables of the same name. The innermost block logs 3, the middle block logs 2, and the global scope logs 1. This is a key difference from <code>var</code>, which would be function-scoped rather than block-scoped.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var11',
      question: 'What is the output of this code?\n<code>const person = {name: "Alice"};\nperson.name = "Bob";\nconsole.log(person.name);</code>',
      options: [
        '"Alice"', 
        '"Bob"', 
        'TypeError: Cannot assign to property', 
        'undefined'
      ],
      correctAnswer: 1,
      explanation:
        "When using <code>const</code> with objects, the binding between the variable name and the object is immutable, but the object's contents are still mutable. This means you can't reassign <code>person</code> to a different object, but you can modify <code>person.name</code>. After execution, <code>person.name</code> is \"Bob\".",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var12',
      question: 'Which of these is a reserved keyword in JavaScript that cannot be used as a variable name?',
      options: ['data', 'value', 'result', 'class'],
      correctAnswer: 3,
      explanation:
        "<code>class</code> is a reserved keyword in JavaScript and cannot be used as a variable name. Using reserved keywords as variable names will result in a syntax error. Other reserved keywords include <code>if</code>, <code>for</code>, <code>function</code>, <code>return</code>, <code>const</code>, <code>let</code>, etc. Always check if a word is reserved before using it as a variable name.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var13',
      question: 'What\'s the difference between variables declared with var, let, and const regarding hoisting?',
      options: [
        'Only var variables are hoisted', 
        'All three are hoisted, but let and const remain in the Temporal Dead Zone until declaration', 
        'None of them are hoisted', 
        'Only const variables are hoisted'
      ],
      correctAnswer: 1,
      explanation:
        "All variable declarations in JavaScript are hoisted (moved to the top of their scope), but <code>var</code> variables are initialized with <code>undefined</code>, while <code>let</code> and <code>const</code> variables remain uninitialized in the 'Temporal Dead Zone' until the declaration line is executed. This is why accessing <code>let</code> or <code>const</code> before declaration throws a ReferenceError.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var14',
      question: 'What is the output of this code?\n<code>console.log(typeof undeclaredVar);</code>',
      options: [
        '"undefined"', 
        '"null"', 
        'ReferenceError', 
        '"object"'
      ],
      correctAnswer: 0,
      explanation:
        "Using <code>typeof</code> with an undeclared variable doesn't throw an error in JavaScript. Instead, it returns the string <code>\"undefined\"</code>. This is a safety mechanism in JavaScript that allows checking if a variable exists without causing an error. However, directly accessing an undeclared variable without <code>typeof</code> would throw a ReferenceError.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var15',
      question: 'What will the following code output?\n<code>let x = 10;\nfunction test() {\n  console.log(x);\n  let x = 20;\n}\ntest();</code>',
      options: [
        '10', 
        '20', 
        'undefined', 
        'ReferenceError'
      ],
      correctAnswer: 3,
      explanation:
        "This code throws a <code>ReferenceError</code> because of the Temporal Dead Zone. The <code>x</code> inside the function shadows the global <code>x</code>, but it can't be accessed before its declaration within the same scope. Even though there's a console.log before the <code>let x = 20</code> line, the entire scope is affected by the TDZ for that variable.",
      category: 'JavaScript Variables',
      difficulty: 'hard',
    },
    {
      id: 'var16',
      question: 'What does the following code return?\n<code>const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr);</code>',
      options: [
        '[1, 2, 3]', 
        '[1, 2, 3, 4]', 
        'TypeError: Cannot add property 3, object is not extensible', 
        'SyntaxError: Invalid operation'
      ],
      correctAnswer: 1,
      explanation:
        "When using <code>const</code> with arrays, like with objects, only the binding is immutable. The array itself can still be modified using methods like <code>push()</code>, <code>pop()</code>, <code>splice()</code>, etc. The code adds 4 to the array and outputs <code>[1, 2, 3, 4]</code>. What we can't do is reassign <code>arr</code> to a completely new array.",
      category: 'JavaScript Variables',
      difficulty: 'easy',
    },
    {
      id: 'var17',
      question: 'Which of the following correctly uses array destructuring to assign variables?',
      options: [
        'const {a, b} = [1, 2];', 
        'const [a, b] = [1, 2];', 
        'const [a, b] = {a: 1, b: 2};', 
        'const a, b = [1, 2];'
      ],
      correctAnswer: 1,
      explanation:
        "Array destructuring uses square brackets on the left side to extract values from arrays into distinct variables. <code>const [a, b] = [1, 2];</code> assigns <code>a = 1</code> and <code>b = 2</code>. Curly braces are used for object destructuring, not array destructuring. The position in the array determines which variable gets which value.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'var18',
      question: 'What happens when you declare a variable in JavaScript without var, let, or const?',
      options: [
        'It becomes a local variable', 
        'It becomes a global variable attached to the window object (in browsers)', 
        'It throws a SyntaxError', 
        'It becomes undefined'
      ],
      correctAnswer: 1,
      explanation:
        "When you assign a value to a variable without declaring it using <code>var</code>, <code>let</code>, or <code>const</code>, it becomes an automatic global variable attached to the global object (<code>window</code> in browsers). This is considered bad practice as it can lead to unexpected behavior and bugs. Always declare your variables with appropriate keywords.",
      category: 'JavaScript Variables',
      difficulty: 'medium',
    },
    {
      id: 'js1',
      question: 'What is the output of <code>console.log(typeof null)</code>?',
      options: ['null', 'object', 'undefined', 'number'],
      correctAnswer: 1,
      explanation:
        "In JavaScript, <code>typeof null</code> returns 'object', which is considered a bug in the language. It was supposed to return 'null', but this behavior has been maintained for backward compatibility.",
      category: 'JavaScript Basics',
      difficulty: 'easy',
    },
    {
      id: 'js10',
      question: 'What is the output of <code>console.log(0.1 + 0.2 === 0.3)</code>?',
      options: ['true', 'false', 'undefined', 'Error'],
      correctAnswer: 1,
      explanation:
        'The output is false. Due to how floating-point numbers are represented in binary, 0.1 + 0.2 actually equals 0.30000000000000004, not exactly 0.3.',
      category: 'JavaScript Basics',
      difficulty: 'easy',
    },
    {
      id: 'js12',
      question:
        'What is the difference between <code>let</code>, <code>const</code>, and <code>var</code>?',
      options: [
        'They are all identical ways to declare variables',
        'let and const are block-scoped, while var is function-scoped',
        'const and var are block-scoped, while let is function-scoped',
        'let and var can be reassigned, while const is for constants only',
      ],
      correctAnswer: 1,
      explanation:
        "let and const are block-scoped (only accessible within the block they're defined in), while var is function-scoped. Additionally, const variables cannot be reassigned after declaration, while let and var can be.",
      category: 'Variables',
      difficulty: 'easy',
    },
    {
      id: 'js15',
      question: 'What is the purpose of the <code>Symbol</code> type in JavaScript?',
      options: [
        'To create unique identifiers',
        'To represent mathematical symbols',
        'To encrypt sensitive data',
        'To create special characters in strings',
      ],
      correctAnswer: 0,
      explanation:
        'The Symbol type in JavaScript is used to create unique identifiers. Every Symbol value is unique and immutable, making them ideal for object property keys when you want to avoid name collisions.',
      category: 'Data Types',
      difficulty: 'hard',
    },
  ];
  
  export default variableQuestions;
