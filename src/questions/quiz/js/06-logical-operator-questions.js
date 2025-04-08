const logicalOperatorQuestions = [
    {
      id: 'log1',
      question: 'What is the output of this code?\n<code>const userInput = "";\nconst username = userInput || "Guest";\n\nif (!userInput) {\n  console.log(`Welcome, ${username}! Please consider creating an account.`);\n}</code>',
      options: [
        'Welcome, Guest! Please consider creating an account.',
        'Welcome, ! Please consider creating an account.',
        'Nothing is logged',
        'TypeError'
      ],
      correctAnswer: 0,
      explanation: 
        "This demonstrates a practical use of the NOT operator with the logical OR for default values. Since <code>userInput</code> is an empty string (falsy), <code>!userInput</code> evaluates to true, executing the if block. The OR operator in <code>userInput || \"Guest\"</code> returns \"Guest\" because the first operand is falsy. This pattern is commonly used in user interfaces to display default values when user input is missing and to show different UI elements based on input state.",
      category: 'Logical Operators',
      difficulty: 'easy',
    },
    {
      id: 'log2',
      question: 'What is the output of this code?\n<code>function validateInput(value) {\n  if (!value) {\n    return "Value is required";\n  }\n  return "Input is valid";\n}\n\nconsole.log(validateInput(0));\nconsole.log(validateInput("Hello"));</code>',
      options: [
        '"Value is required", "Value is required"', 
        '"Value is required", "Input is valid"', 
        '"Input is valid", "Value is required"', 
        '"Input is valid", "Input is valid"'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates using the NOT operator for input validation, a common real-world scenario. The number 0 is falsy in JavaScript, so <code>!value</code> evaluates to true and returns the error message. The string \"Hello\" is truthy, so <code>!value</code> evaluates to false and returns the success message. This pattern is frequently used in form validation to check if required fields have values. Understanding falsy values (0, \"\", null, undefined, NaN, false) is crucial for writing correct validation logic.",
      category: 'Logical Operators',
      difficulty: 'easy',
    },
    {
      id: 'log3',
      question: 'What is the output of this code?\n<code>const toggleFeature = (currentState) => !currentState;\n\nlet darkMode = false;\nconsole.log(`Dark mode: ${darkMode}`);\n\ndarkMode = toggleFeature(darkMode);\nconsole.log(`Dark mode after toggle: ${darkMode}`);\n\ndarkMode = toggleFeature(darkMode);\nconsole.log(`Dark mode after second toggle: ${darkMode}`);</code>',
      options: [
        'Dark mode: false, Dark mode after toggle: false, Dark mode after second toggle: false', 
        'Dark mode: false, Dark mode after toggle: true, Dark mode after second toggle: false', 
        'Dark mode: false, Dark mode after toggle: true, Dark mode after second toggle: true', 
        'Dark mode: false, Dark mode after toggle: false, Dark mode after second toggle: true'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates using the NOT operator to toggle boolean states, a common pattern in interactive applications. The <code>toggleFeature</code> function flips any boolean value using the NOT operator. Starting with <code>darkMode</code> as false, the first toggle changes it to true, and the second toggle changes it back to false. This pattern is used extensively in UI development for toggling settings, showing/hiding elements, and implementing features like dark mode. It's more concise than conditional statements for simple boolean toggling.",
      category: 'Logical Operators',
      difficulty: 'easy',
    },
    {
      id: 'log4',
      question: 'What is the output of this code?\n<code>const isEmpty = value => !value || (Array.isArray(value) && !value.length);\n\nconsole.log(isEmpty(""));\nconsole.log(isEmpty([]));\nconsole.log(isEmpty(0));\nconsole.log(isEmpty("Hello"));\nconsole.log(isEmpty([1, 2, 3]));</code>',
      options: [
        'true, false, true, false, false', 
        'true, true, true, false, false', 
        'true, true, false, false, false', 
        'true, false, true, true, false'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates a practical utility function that uses the NOT operator to check if a value is empty. The function considers a value empty if it's falsy OR if it's an array with no elements. This handles the edge case where empty arrays are truthy but should be considered empty. The results are: empty string (true), empty array (true), 0 (true), non-empty string (false), non-empty array (false). This pattern is commonly used in form validation, data processing, and UI rendering to handle different types of empty values consistently.",
      category: 'Logical Operators',
      difficulty: 'medium',
    },
    {
      id: 'log5',
      question: 'What is the output of this code?\n<code>const authenticate = (user) => {\n  if (!user.isLoggedIn) {\n    return "Please log in";\n  }\n  \n  if (!user.hasPermission) {\n    return "Access denied";\n  }\n  \n  return "Welcome to the dashboard";\n};\n\nconst user1 = { isLoggedIn: true, hasPermission: false };\nconst user2 = { isLoggedIn: true, hasPermission: true };\n\nconsole.log(authenticate(user1));\nconsole.log(authenticate(user2));</code>',
      options: [
        '"Please log in", "Please log in"', 
        '"Please log in", "Welcome to the dashboard"', 
        '"Access denied", "Please log in"', 
        '"Access denied", "Welcome to the dashboard"'
      ],
      correctAnswer: 3,
      explanation:
        "This demonstrates using the NOT operator for multi-level authorization checks, a common pattern in web applications. The function first checks if the user is NOT logged in, then checks if they do NOT have permission. For user1 (logged in but no permission), the second check fails, returning \"Access denied\". For user2 (logged in with permission), both checks pass, returning the welcome message. This pattern of using multiple NOT operators for validation creates a \"guard clause\" pattern that makes code more readable by handling error cases early and reducing nesting.",
      category: 'Logical Operators',
      difficulty: 'medium',
    },
    {
      id: 'log6',
      question: 'What is the output of this code?\n<code>const ensureBoolean = value => !!value;\n\nconst processValues = values => {\n  return values.map(ensureBoolean);\n};\n\nconsole.log(processValues([0, 1, "", "hello", null, {}, []]));</code>',
      options: [
        '[false, true, false, true, false, true, true]', 
        '[false, true, false, true, false, true, false]', 
        '[false, true, false, true, false, false, false]', 
        '[0, 1, "", "hello", null, {}, []]'
      ],
      correctAnswer: 0,
      explanation:
        "This demonstrates double negation (!!) to explicitly convert values to booleans, a technique used in data normalization. The <code>ensureBoolean</code> function uses !! to convert any value to its boolean equivalent based on truthiness. The results show how JavaScript evaluates different values: 0, empty string, and null are falsy (become false), while 1, non-empty string, empty object, and empty array are truthy (become true). This pattern is useful when working with APIs that expect boolean values, normalizing data for storage, or ensuring consistent types in application state.",
      category: 'Logical Operators',
      difficulty: 'medium',
    },
    {
      id: 'log7',
      question: 'What is the output of this code?\n<code>const checkPermissions = (user = {}) => {\n  // Convert to boolean and negate\n  const isNotAdmin = !user.isAdmin;\n  // Double negation to convert to boolean\n  const hasAccess = !!user.accessLevel;\n  \n  return `Admin: ${!isNotAdmin}, Access: ${hasAccess}`;\n};\n\nconst user1 = { isAdmin: true, accessLevel: 2 };\nconst user2 = { isAdmin: false, accessLevel: 0 };\n\nconsole.log(checkPermissions(user1));\nconsole.log(checkPermissions(user2));</code>',
      options: [
        'Admin: true, Access: true, Admin: false, Access: false', 
        'Admin: true, Access: true, Admin: false, Access: true', 
        'Admin: true, Access: true, Admin: true, Access: false', 
        'Admin: false, Access: true, Admin: true, Access: false'
      ],
      correctAnswer: 0,
      explanation:
        "This demonstrates combining NOT and double negation in a practical authorization scenario. For user1, <code>isNotAdmin</code> is false (NOT true), so <code>!isNotAdmin</code> is true. <code>hasAccess</code> is true (!! converts non-zero to true). For user2, <code>isNotAdmin</code> is true (NOT false), so <code>!isNotAdmin</code> is false. <code>hasAccess</code> is false (!! converts zero to false). This shows how logical operators can be used to transform and normalize values in complex conditions. The double negation ensures boolean type, while the single negation handles the logical inversion needed for the business logic.",
      category: 'Logical Operators',
      difficulty: 'hard',
    },
    {
      id: 'log8',
      question: 'What is the output of this code?\n<code>const safelyGetNestedValue = (obj, path) => {\n  if (!obj || !path) return undefined;\n  \n  const keys = path.split(".");\n  let current = obj;\n  \n  for (const key of keys) {\n    if (!current[key]) return undefined;\n    current = current[key];\n  }\n  \n  return current;\n};\n\nconst data = {\n  user: {\n    name: "Alice",\n    settings: {\n      notifications: false\n    }\n  }\n};\n\nconsole.log(safelyGetNestedValue(data, "user.settings.notifications"));\nconsole.log(safelyGetNestedValue(data, "user.profile.image"));</code>',
      options: [
        'false, undefined', 
        'false, null', 
        'undefined, undefined', 
        'false, false'
      ],
      correctAnswer: 0,
      explanation:
        "This demonstrates using the NOT operator for safe property access, a pattern used before optional chaining was available. The function first checks if the object and path exist. Then, for each key in the path, it checks if the current level has that property. For \"user.settings.notifications\", all properties exist and the value false is returned. For \"user.profile.image\", the check <code>!current[key]</code> at \"profile\" returns true (since undefined is falsy), so the function returns undefined. This pattern prevents the dreaded \"Cannot read property of undefined\" errors that often occur when accessing nested properties. Modern code would use optional chaining: <code>data?.user?.profile?.image</code>.",
      category: 'Logical Operators',
      difficulty: 'hard',
    },
    {
      id: 'log9',
      question: 'What is the output of this code?\n<code>const filterTruthy = arr => arr.filter(Boolean);\n\n// Using double negation for the same purpose\nconst filterTruthy2 = arr => arr.filter(item => !!item);\n\nconst values = [0, false, "", undefined, null, NaN, 42, "hello", {}, []];\n\nconsole.log(filterTruthy(values).length);\nconsole.log(filterTruthy2(values).length);</code>',
      options: [
        '0, 0', 
        '4, 4', 
        '6, 6', 
        '10, 10'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates a clever use of Boolean as a function and double negation to filter out falsy values, a common functional programming pattern. Both <code>Boolean</code> and <code>!!item</code> convert values to true or false based on their truthiness. The <code>filter</code> method keeps only elements for which the callback returns true. From the original array, only 4 values are truthy: 42, \"hello\", {} (empty object), and [] (empty array). This pattern is frequently used to clean up data by removing null, undefined, and other falsy values before processing. Using <code>Boolean</code> directly is more concise but less obvious to some developers than the explicit <code>!!item</code>.",
      category: 'Logical Operators',
      difficulty: 'medium',
    },
    {
      id: 'log10',
      question: 'What is the output of this code?\n<code>const checkValue = value => {\n  if (!!value !== Boolean(value)) {\n    return "Different results";\n  }\n  return value ? "Truthy" : "Falsy";\n};\n\nconsole.log(checkValue(""));\nconsole.log(checkValue({}));\nconsole.log(checkValue(NaN));\nconsole.log(checkValue(new Boolean(false)));</code>',
      options: [
        '"Falsy", "Truthy", "Falsy", "Falsy"', 
        '"Falsy", "Truthy", "Falsy", "Different results"', 
        '"Falsy", "Truthy", "Falsy", "Truthy"', 
        '"Different results", "Different results", "Different results", "Different results"'
      ],
      correctAnswer: 1,
      explanation:
        "This demonstrates a subtle difference between double negation and the Boolean constructor. For most values, <code>!!value</code> and <code>Boolean(value)</code> produce identical results based on truthiness. However, <code>new Boolean(false)</code> is an object, which is truthy, even though its internal value is false! So <code>!!(new Boolean(false))</code> is true, but when used in a condition directly, it's converted to its primitive value: false. This is why <code>Boolean</code> without <code>new</code> is preferred for type conversion. This question highlights the difference between primitive boolean values and Boolean objects, a distinction that can cause subtle bugs.",
      category: 'Logical Operators',
      difficulty: 'hard',
    },
    {
      id: 'js6',
      question: 'What is the event loop in JavaScript?',
      options: [
        'A design pattern for handling UI events',
        'A mechanism that allows JavaScript to perform non-blocking operations',
        'A loop that iterates through all DOM events',
        'A special type of for loop',
      ],
      correctAnswer: 1,
      explanation:
        'The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It handles executing code, collecting and processing events, and executing queued sub-tasks.',
      category: 'Asynchronous JavaScript',
      difficulty: 'medium',
    },
    {
      id: 'js7',
      question:
        'What will be the output of the following code?\n<pre><code>console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);</code></pre>',
      options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '4, 3, 2, 1'],
      correctAnswer: 1,
      explanation:
        'The output will be 1, 4, 3, 2. First, synchronous code executes (1, 4). Then, microtasks like Promises are processed (3). Finally, macrotasks like setTimeout callbacks are executed (2), even with a delay of 0ms.',
      category: 'Asynchronous JavaScript',
      difficulty: 'hard',
    },
    {
      id: 'js9',
      question: 'What is a Promise in JavaScript?',
      options: [
        'A guarantee that a function will execute successfully',
        'An object representing the eventual completion or failure of an asynchronous operation',
        'A special type of callback function',
        'A way to promise code will run in the future',
      ],
      correctAnswer: 1,
      explanation:
        "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It allows you to associate handlers with an asynchronous action's eventual success or failure.",
      category: 'Asynchronous JavaScript',
      difficulty: 'medium',
    },
];

export default logicalOperatorQuestions;
