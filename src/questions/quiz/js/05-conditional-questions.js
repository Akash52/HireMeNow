const conditionalQuestions = [
    {
      id: 'cond1',
      question: 'What is the output of this code?\n<code>const age = 24;\nconst jamesAge = 22;\nconst valerieAge = 25;\n\nif (age < jamesAge) {\n  console.log("Younger than James");\n} else if (age > valerieAge) {\n  console.log("Older than Valerie");\n} else if (age >= jamesAge && age <= valerieAge) {\n  console.log("Between James and Valerie");\n} else {\n  console.log("Age comparison error");\n}</code>',
      options: [
        '"Younger than James"', 
        '"Older than Valerie"', 
        '"Between James and Valerie"', 
        '"Age comparison error"'
      ],
      correctAnswer: 2,
      explanation: 
        "This code demonstrates a multi-condition if/else statement with logical operators. Since 24 is not less than 22 (James's age), the first condition fails. Since 24 is not greater than 25 (Valerie's age), the second condition fails. The third condition checks if age is between James and Valerie's ages (inclusive of James's age): 24 ≥ 22 && 24 ≤ 25 evaluates to true, so \"Between James and Valerie\" is logged. Understanding how conditions are evaluated in sequence is crucial for controlling program flow correctly.",
      category: 'JavaScript Conditionals',
      difficulty: 'easy',
    },
    {
      id: 'cond2',
      question: 'What is the output of this code?\n<code>const value = 0;\n\nif (value) {\n  console.log("Truthy");\n} else {\n  console.log("Falsy");\n}</code>',
      options: ['"Truthy"', '"Falsy"', 'undefined', 'Error'],
      correctAnswer: 1,
      explanation:
        "This demonstrates JavaScript's truthy and falsy values. In JavaScript, when a non-boolean value is used in a boolean context (like an if condition), it's automatically converted to a boolean. The number 0 is one of JavaScript's six falsy values (false, 0, \"\", null, undefined, and NaN), so it converts to false and the else block executes. Understanding truthy and falsy values is essential for writing concise conditional logic and avoiding subtle bugs with type coercion.",
      category: 'JavaScript Conditionals',
      difficulty: 'easy',
    },
    {
      id: 'cond3',
      question: 'What is the output of this code?\n<code>const emptyArray = [];\nconst emptyObject = {};\n\nif (emptyArray) {\n  console.log("Array is truthy");\n}\n\nif (emptyObject) {\n  console.log("Object is truthy");\n}</code>',
      options: [
        'Nothing is logged', 
        'Only "Array is truthy" is logged', 
        'Only "Object is truthy" is logged', 
        'Both messages are logged'
      ],
      correctAnswer: 3,
      explanation:
        "This demonstrates an important nuance of JavaScript's truthy/falsy system: empty arrays and empty objects are both truthy! Many developers mistakenly assume they're falsy because they're \"empty\". In JavaScript, all objects (including arrays) are truthy regardless of their contents. To check if an array is empty, use <code>array.length === 0</code>. To check if an object has no properties, use <code>Object.keys(obj).length === 0</code>. This behavior often leads to bugs when developers attempt to use an array or object directly as a condition.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond4',
      question: 'What is the output of this code?\n<code>const a = 0;\nconst b = "0";\n\nif (a == b) {\n  console.log("Loose equality: true");\n}\n\nif (a === b) {\n  console.log("Strict equality: true");\n}</code>',
      options: [
        'Nothing is logged', 
        'Only "Loose equality: true" is logged', 
        'Only "Strict equality: true" is logged', 
        'Both messages are logged'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates the difference between loose (==) and strict (===) equality in JavaScript. Loose equality performs type coercion before comparison, so 0 == \"0\" is true because the string \"0\" is converted to the number 0. Strict equality requires both value and type to match, so 0 === \"0\" is false because they have different types. Using strict equality is generally recommended to avoid unexpected behavior from type coercion. This distinction is crucial for writing predictable code, especially when comparing user input or API responses.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond5',
      question: 'What is the output of this code?\n<code>const value = "";\n\nif (!value) {\n  console.log("Empty string is falsy");\n}\n\nif (value === false) {\n  console.log("Empty string equals false");\n}</code>',
      options: [
        'Nothing is logged', 
        'Only "Empty string is falsy" is logged', 
        'Only "Empty string equals false" is logged', 
        'Both messages are logged'
      ],
      correctAnswer: 1,
      explanation:
        "This highlights an important distinction in JavaScript: a value can be falsy without being equal to false. The empty string is falsy, so <code>!value</code> evaluates to true and the first message is logged. However, <code>value === false</code> is false because an empty string and the boolean false are different types and values. This demonstrates why understanding both truthiness and equality is important. A common mistake is assuming that all falsy values are interchangeable or equal to each other, which can lead to subtle logical errors.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond6',
      question: 'What is the output of this code?\n<code>const userRole = "admin";\nconst isLoggedIn = true;\n\nconst canEditSettings = userRole === "admin" && isLoggedIn;\nconst canViewProfile = userRole === "user" || userRole === "admin";\n\nconsole.log(`Can edit settings: ${canEditSettings}`);\nconsole.log(`Can view profile: ${canViewProfile}`);</code>',
      options: [
        'Can edit settings: false, Can view profile: false', 
        'Can edit settings: true, Can view profile: false', 
        'Can edit settings: false, Can view profile: true', 
        'Can edit settings: true, Can view profile: true'
      ],
      correctAnswer: 3,
      explanation:
        "This demonstrates logical operators for permission checking, a common real-world use case. The AND operator (&&) requires both conditions to be true: userRole is \"admin\" and isLoggedIn is true, so canEditSettings is true. The OR operator (||) requires only one condition to be true: userRole is \"admin\" (but not \"user\"), so canViewProfile is true. This pattern of combining conditions with logical operators is essential for implementing access control, validation logic, and business rules in applications. Understanding operator precedence and short-circuit evaluation helps write more efficient conditions.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond7',
      question: 'What is the output of this code?\n<code>const value = null;\nconst defaultValue = "Not provided";\n\nconst result = value || defaultValue;\nconsole.log(result);</code>',
      options: ['null', '"Not provided"', 'undefined', 'false'],
      correctAnswer: 1,
      explanation:
        "This demonstrates the logical OR operator (||) for providing default values, one of the most useful patterns in JavaScript. When used with non-boolean values, || returns the first truthy operand, or the last operand if all are falsy. Since null is falsy, the expression evaluates to defaultValue. This pattern is commonly used to provide fallbacks for missing values, especially before the nullish coalescing operator (??) was introduced. It's more concise than an if/else statement but behaves differently with values like 0 or empty strings, which are falsy but might be valid in some contexts.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond8',
      question: 'What is the output of this code?\n<code>const score = 85;\n\nconst grade = \n  score >= 90 ? "A" :\n  score >= 80 ? "B" :\n  score >= 70 ? "C" :\n  score >= 60 ? "D" : "F";\n\nconsole.log(`Score: ${score}, Grade: ${grade}`);</code>',
      options: [
        'Score: 85, Grade: A', 
        'Score: 85, Grade: B', 
        'Score: 85, Grade: C', 
        'Score: 85, Grade: F'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates nested ternary operators for multi-way conditionals. The code checks score ranges in descending order: first if score ≥ 90 (false), then if score ≥ 80 (true, so grade is \"B\"). Nested ternaries can replace lengthy if/else chains for simple value assignment. While powerful and concise, they should be used judiciously as they can reduce readability when overused or poorly formatted. This pattern is particularly useful for mapping values to categories or calculating derived values based on thresholds, common in scoring systems, pricing tiers, or status indicators.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond9',
      question: 'What is the output of this code?\n<code>const user = {\n  name: "Alice",\n  permissions: {\n    canEdit: true\n  }\n};\n\n// Using optional chaining\nif (user?.permissions?.canEdit) {\n  console.log("User can edit");\n}\n\n// Without optional chaining\nif (user && user.permissions && user.permissions.canEdit) {\n  console.log("User can edit (traditional check)");\n}</code>',
      options: [
        'Nothing is logged', 
        'Only "User can edit" is logged', 
        'Only "User can edit (traditional check)" is logged', 
        'Both messages are logged'
      ],
      correctAnswer: 3,
      explanation:
        "This demonstrates optional chaining (?.), a modern JavaScript feature that simplifies accessing nested properties that might be undefined. Both conditions check if the user has edit permission, but with different syntax. The traditional approach uses the && operator to short-circuit if any property in the chain is undefined. Optional chaining is more concise and readable, especially with deeply nested properties. Both conditions evaluate to true in this case because user.permissions.canEdit is true. This pattern is essential for safely accessing properties in objects from APIs, user input, or any data with uncertain structure.",
      category: 'JavaScript Conditionals',
      difficulty: 'medium',
    },
    {
      id: 'cond10',
      question: 'What is the output of this code?\n<code>const value = -1;\n\nif (value) {\n  console.log("Truthy");\n} else {\n  console.log("Falsy");\n}\n\nif (value == true) {\n  console.log("Loosely equals true");\n}\n\nif (Boolean(value) === true) {\n  console.log("Explicitly converted to true");\n}</code>',
      options: [
        'Only "Falsy" is logged', 
        'Only "Truthy" is logged', 
        '"Truthy" and "Loosely equals true" are logged', 
        '"Truthy" and "Explicitly converted to true" are logged'
      ],
      correctAnswer: 3,
      explanation:
        "This demonstrates nuanced behavior with negative numbers in conditional contexts. All non-zero numbers (including -1) are truthy in JavaScript, so the first condition logs \"Truthy\". However, <code>value == true</code> is false because when comparing a number to a boolean with ==, JavaScript converts both to numbers (true becomes 1), and -1 != 1. The explicit conversion <code>Boolean(value)</code> correctly converts -1 to true. This highlights why understanding type coercion rules is important - a value can be truthy in an if statement but not loosely equal to true! This distinction is particularly relevant when working with form inputs or API data that might contain various numeric values.",
      category: 'JavaScript Conditionals',
      difficulty: 'hard',
    },
    {
      id: 'cond11',
      question: 'What is the output of this code?\n<code>const checkValue = (value) => {\n  switch (typeof value) {\n    case "number":\n      return value !== 0 ? "Non-zero number" : "Zero";\n    case "string":\n      return value.length ? "Non-empty string" : "Empty string";\n    case "boolean":\n      return value ? "True" : "False";\n    case "object":\n      return value !== null ? "Object" : "Null";\n    default:\n      return "Other type";\n  }\n};\n\nconsole.log(checkValue(""));\nconsole.log(checkValue([]));</code>',
      options: [
        '"Empty string", "Empty string"', 
        '"Empty string", "Object"', 
        '"Empty string", "Other type"', 
        '"Non-empty string", "Object"'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates the switch statement with the typeof operator to handle different value types. For the empty string, typeof returns \"string\" and the length is 0, so it returns \"Empty string\". For the empty array, typeof returns \"object\" (arrays are objects in JavaScript) and it's not null, so it returns \"Object\". This pattern is useful for type-based processing, input validation, and creating flexible functions that handle multiple data types. The switch statement provides a cleaner alternative to multiple if/else statements when checking against specific values, improving code readability for complex branching logic.",
      category: 'JavaScript Conditionals',
      difficulty: 'hard',
    },
    {
      id: 'cond12',
      question: 'What is the output of this code?\n<code>const config = {\n  darkMode: false,\n  notifications: true,\n  // theme property not defined\n};\n\n// Using nullish coalescing and optional chaining\nconst theme = config.theme ?? "light";\nconst isDarkMode = config.darkMode ?? true;\nconst allowNotifications = config.notifications ?? false;\nconst fontSize = config.display?.fontSize ?? 16;\n\nconsole.log(`Theme: ${theme}, Dark Mode: ${isDarkMode}, Notifications: ${allowNotifications}, Font Size: ${fontSize}`);</code>',
      options: [
        'Theme: light, Dark Mode: true, Notifications: true, Font Size: 16', 
        'Theme: light, Dark Mode: false, Notifications: true, Font Size: 16', 
        'Theme: undefined, Dark Mode: false, Notifications: true, Font Size: 16', 
        'Theme: light, Dark Mode: false, Notifications: true, Font Size: undefined'
      ],
      correctAnswer: 1,
        explanation:
            "This demonstrates the nullish coalescing operator (??) and optional chaining (?.) for safely accessing properties and providing defaults. The theme is not defined, so it defaults to \"light\". darkMode is explicitly false, so it remains false. notifications is true, so it stays true. display is undefined, so fontSize defaults to 16. This pattern is useful for handling configurations or API responses where some properties may be missing or undefined. Using ?? allows you to provide a default only when the left operand is null or undefined, unlike || which considers all falsy values.",
        category: 'JavaScript Conditionals',
        difficulty: 'hard',
    },
    ];
export default conditionalQuestions;
  