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
    }
  ];
  
  export default variableQuestions;
  