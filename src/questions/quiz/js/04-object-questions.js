const objectQuestions = [
    {
      id: 'obj1',
      question: 'What is the output of this code?\n<code>const user = {\n  name: "Alice",\n  "user-id": 42,\n  greet() {\n    return `Hello, ${this.name}`;\n  }\n};\nconsole.log(user.name);\nconsole.log(user["user-id"]);</code>',
      options: [
        '"Alice", 42', 
        '"Alice", undefined', 
        'undefined, 42', 
        'Error'
      ],
      correctAnswer: 0,
      explanation: 
        "This demonstrates two ways to access object properties. Dot notation (<code>user.name</code>) is cleaner but only works with valid JavaScript identifiers. Bracket notation (<code>user[\"user-id\"]</code>) works with any string, including those containing special characters like hyphens. Property names with special characters or spaces must use bracket notation. Understanding both access methods is essential for working with various data formats like API responses.",
      category: 'JavaScript Objects',
      difficulty: 'easy',
    },
    {
      id: 'obj2',
      question: 'What is the output of this code?\n<code>const key = "age";\nconst person = {\n  name: "Bob",\n  age: 30\n};\n\nperson[key] = 31;\nconsole.log(person.age);</code>',
      options: ['30', '31', 'undefined', 'Error'],
      correctAnswer: 1,
      explanation:
        "This demonstrates dynamic property access and modification using bracket notation with variables. When <code>person[key]</code> is used, JavaScript evaluates <code>key</code> to \"age\" and updates that property to 31. This dynamic property access is powerful for programmatically working with objects when property names are stored in variables or determined at runtime - a common scenario when processing form data or API responses.",
      category: 'JavaScript Objects',
      difficulty: 'easy',
    },
    {
      id: 'obj3',
      question: 'What is the output of this code?\n<code>const user = {\n  name: "Charlie",\n  sayHi() {\n    return `Hi, I'm ${this.name}`;\n  }\n};\n\nconst greet = user.sayHi;\nconsole.log(greet());</code>',
      options: [
        'Hi, I\'m Charlie', 
        'Hi, I\'m undefined', 
        'TypeError', 
        'Hi, I\'m '
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates how <code>this</code> binding works in JavaScript objects. When a method is called directly on an object (<code>user.sayHi()</code>), <code>this</code> refers to that object. However, when the method is assigned to a variable and called separately (<code>greet()</code>), it loses its context and <code>this</code> becomes the global object (or <code>undefined</code> in strict mode). This is a common source of bugs. To preserve context, use <code>const greet = user.sayHi.bind(user);</code> or arrow functions which don't have their own <code>this</code>.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj4',
      question: 'What is the output of this code?\n<code>const config = {\n  api: {\n    baseURL: "https://api.example.com",\n    endpoints: {\n      users: "/users",\n      posts: "/posts"\n    }\n  }\n};\n\nconsole.log(config.api.endpoints.users);</code>',
      options: ['"https://api.example.com/users"', '"/users"', 'undefined', 'Error'],
      correctAnswer: 1,
      explanation:
        "This demonstrates nested objects, a common pattern for configuration and complex data structures. The expression <code>config.api.endpoints.users</code> navigates through multiple levels of the object to access the value \"/users\". Nested objects help organize related data hierarchically, making code more maintainable. However, deep nesting can lead to verbose access patterns and potential errors if any intermediate property is undefined. Modern JavaScript offers solutions like optional chaining (<code>config.api?.endpoints?.users</code>) to handle such cases safely.",
      category: 'JavaScript Objects',
      difficulty: 'easy',
    },
    {
      id: 'obj5',
      question: 'What is the output of this code?\n<code>const person = {\n  firstName: "John",\n  lastName: "Doe",\n  get fullName() {\n    return `${this.firstName} ${this.lastName}`;\n  },\n  set fullName(name) {\n    [this.firstName, this.lastName] = name.split(" ");\n  }\n};\n\nperson.fullName = "Jane Smith";\nconsole.log(person.firstName);\nconsole.log(person.fullName);</code>',
      options: [
        'John, John Doe', 
        'Jane, Jane Smith', 
        'Jane Smith, Jane Smith', 
        'undefined, Jane Smith'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates JavaScript getters and setters, which allow you to define special methods that execute when a property is accessed or modified. The <code>set fullName</code> method parses the input string and updates both <code>firstName</code> and <code>lastName</code>. The <code>get fullName</code> method computes and returns the full name on demand. Getters and setters enable powerful patterns like computed properties, validation, and side effects when properties change, while maintaining a clean object interface. They're widely used in frameworks like Vue.js for reactive properties.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj6',
      question: 'What is the output of this code?\n<code>const defaults = {\n  theme: "light",\n  notifications: true,\n  vibration: false\n};\n\nconst userPrefs = {\n  theme: "dark"\n};\n\nconst settings = {...defaults, ...userPrefs};\nconsole.log(settings.theme);\nconsole.log(settings.notifications);</code>',
      options: [
        'light, true', 
        'dark, true', 
        'dark, undefined', 
        'undefined, true'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates object spreading, a modern JavaScript feature for merging objects. The spread operator (<code>...</code>) copies all enumerable properties from source objects to the target. Properties are applied from left to right, so later objects override earlier ones with the same keys. This creates a new object with the default settings overridden by user preferences. This pattern is extremely common in React for merging props, in Redux for state updates, and for creating configuration objects with sensible defaults that can be partially overridden.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj7',
      question: 'What is the output of this code?\n<code>const user = {\n  name: "David",\n  logData(data = "No data") {\n    console.log(`${this.name}: ${data}`);\n  }\n};\n\nconst logger = user.logData;\nlogger("Test");</code>',
      options: [
        'David: Test', 
        'undefined: Test', 
        'David: No data', 
        'TypeError'
      ],
      correctAnswer: 1,
      explanation:
        "This highlights the <code>this</code> context issue again, but with a method that takes arguments. When <code>user.logData</code> is assigned to <code>logger</code> and called separately, it loses its binding to <code>user</code>, so <code>this.name</code> becomes <code>undefined</code>. The argument \"Test\" is correctly passed. To fix this, you could use <code>bind</code>, an arrow function, or method shorthand in an object literal. Understanding <code>this</code> binding is crucial for event handlers, callbacks, and any code where functions are passed around as values.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj8',
      question: 'What is the output of this code?\n<code>const data = {\n  temperatures: [22, 24, 23, 25, 22],\n  average() {\n    return this.temperatures.reduce((sum, temp) => sum + temp, 0) / this.temperatures.length;\n  }\n};\n\nconsole.log(data.average());</code>',
      options: ['23.2', '22', '116', 'NaN'],
      correctAnswer: 0,
      explanation:
        "This demonstrates a method that computes a value based on object data. The <code>average</code> method calculates the mean temperature (22+24+23+25+22)/5 = 23.2. Methods like this encapsulate operations on the object's data, following the principle of keeping related data and behavior together. This pattern is fundamental to object-oriented programming and helps create more maintainable code by grouping related functionality. The method uses <code>reduce</code> with an arrow function, which preserves the <code>this</code> context from the outer scope.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj9',
      question: 'What is the output of this code?\n<code>const user = {\n  name: "Elena",\n  greet(greeting = "Hello") {\n    return `${greeting}, I'm ${this.name}`;\n  }\n};\n\nconst admin = {\n  name: "Admin",\n  __proto__: user\n};\n\nconsole.log(admin.greet("Hi"));</code>',
      options: [
        'Hi, I\'m Elena', 
        'Hi, I\'m Admin', 
        'Hello, I\'m Admin', 
        'TypeError'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates JavaScript's prototype inheritance. By setting <code>admin</code>'s <code>__proto__</code> to <code>user</code>, <code>admin</code> inherits all of <code>user</code>'s methods. When <code>admin.greet()</code> is called, JavaScript first looks for a <code>greet</code> method on <code>admin</code>, doesn't find it, then checks its prototype (<code>user</code>) and uses that method. Importantly, <code>this</code> still refers to the calling object (<code>admin</code>), not the prototype. This prototype chain is the foundation of JavaScript's object-oriented capabilities and is used extensively in both built-in objects and custom inheritance patterns.",
      category: 'JavaScript Objects',
      difficulty: 'hard',
    },
    {
      id: 'obj10',
      question: 'What is the output of this code?\n<code>const product = {\n  name: "Laptop",\n  price: 999,\n  discount: 0.15,\n  calculatePrice() {\n    return this.price * (1 - this.discount);\n  },\n  applyExtraDiscount(code) {\n    if (code === "SALE") {\n      this.discount += 0.05;\n    }\n    return this.calculatePrice();\n  }\n};\n\nconsole.log(product.applyExtraDiscount("SALE"));</code>',
      options: ['999', '849.15', '799.2', '949.05'],
      correctAnswer: 2,
      explanation:
        "This demonstrates method chaining and object state modification. The <code>applyExtraDiscount</code> method checks the discount code, increases the discount from 15% to 20% if valid, then calls another method <code>calculatePrice</code> to compute the final price: 999 × (1 - 0.2) = 799.2. This pattern of methods that modify state and then call other methods is common in business logic implementations. The example also shows how methods can take arguments and how objects can maintain internal state that affects calculations - key concepts in building complex systems with encapsulated behavior.",
      category: 'JavaScript Objects',
      difficulty: 'medium',
    },
    {
      id: 'obj11',
      question: 'What is the output of this code?\n<code>const formatter = {\n  currency: "$",\n  format(num) {\n    return `${this.currency}${num.toFixed(2)}`;\n  },\n  formatArray(numbers) {\n    // Using an arrow function\n    return numbers.map(num => this.format(num));\n  }\n};\n\nconsole.log(formatter.formatArray([10, 20.5, 30]));</code>',
      options: [
        '["$10.00", "$20.50", "$30.00"]', 
        '["undefined10.00", "undefined20.50", "undefined30.00"]', 
        'TypeError', 
        '["10.00", "20.50", "30.00"]'
      ],
      correctAnswer: 0,
      explanation:
        "This demonstrates a sophisticated use of arrow functions with object methods. The <code>formatArray</code> method uses <code>map</code> with an arrow function callback. Since arrow functions don't have their own <code>this</code> binding, <code>this</code> inside the arrow function refers to the same <code>this</code> as in the outer <code>formatArray</code> method - the <code>formatter</code> object. This preserves access to <code>this.format</code> and <code>this.currency</code>. If a regular function were used instead (<code>numbers.map(function(num) { return this.format(num); })</code>), <code>this</code> would be undefined or the global object, causing errors. This pattern is extremely useful for callbacks that need to access object methods or properties.",
      category: 'JavaScript Objects',
      difficulty: 'hard',
    },
    {
      id: 'obj12',
      question: 'What is the output of this code?\n<code>const library = {\n  books: [\n    { title: "1984", author: "Orwell" },\n    { title: "Brave New World", author: "Huxley" }\n  ],\n  findByProperty(property, value) {\n    return this.books.find(book => book[property] === value);\n  }\n};\n\nconst result = library.findByProperty("author", "Huxley");\nconsole.log(result?.title);</code>',
      options: [
        '1984', 
        'Brave New World', 
        'undefined', 
        'TypeError'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates several advanced object techniques. First, it shows dynamic property access with bracket notation inside a method (<code>book[property]</code>), allowing the method to search by any property. Second, it uses the array <code>find</code> method with an arrow function to maintain the correct <code>this</code> context. Finally, it uses optional chaining (<code>result?.title</code>) to safely access a property that might not exist if no book was found. The code finds the book with author \"Huxley\" and returns its title. These patterns are essential for building flexible, error-resistant code that can handle dynamic data structures - common in data processing, search functionality, and API interactions.",
      category: 'JavaScript Objects',
      difficulty: 'hard',
    }
  ];
  
  export default objectQuestions;  