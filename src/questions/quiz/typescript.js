export const questions = [
  {
    id: 'ts1',
    question: 'What is TypeScript?',
    options: [
      'A JavaScript library',
      'A superset of JavaScript that adds static typing',
      'A JavaScript framework',
      'A new programming language unrelated to JavaScript',
    ],
    correctAnswer: 1,
    explanation:
      'TypeScript is a superset of JavaScript that adds static typing. It compiles to plain JavaScript and can be used in any JavaScript environment.',
    category: 'TypeScript Basics',
    difficulty: 'easy',
  },
  {
    id: 'ts2',
    question: 'What is the purpose of the <code>interface</code> keyword in TypeScript?',
    options: [
      'To create a new class',
      'To define a contract for object shapes',
      'To implement inheritance',
      'To create a module',
    ],
    correctAnswer: 1,
    explanation:
      "In TypeScript, interfaces define contracts for object shapes. They specify what properties and methods an object must have, but don't provide implementations.",
    category: 'TypeScript Basics',
    difficulty: 'easy',
  },
  {
    id: 'ts3',
    question: "What is a TypeScript 'type assertion'?",
    options: [
      'A way to validate types at runtime',
      'A way to tell the compiler to treat an entity as a different type',
      'A way to convert one type to another at runtime',
      'A way to enforce strict typing',
    ],
    correctAnswer: 1,
    explanation:
      "Type assertions in TypeScript are a way to tell the compiler to treat an entity as a different type. They don't perform any special checking or restructuring of data and have no runtime impact.",
    category: 'TypeScript Basics',
    difficulty: 'medium',
  },
  {
    id: 'ts4',
    question:
      'What is the difference between <code>any</code> and <code>unknown</code> types in TypeScript?',
    options: [
      'They are identical and can be used interchangeably',
      'unknown is a type-safe counterpart of any',
      'any is used for objects while unknown is used for primitives',
      'unknown was deprecated and replaced with any',
    ],
    correctAnswer: 1,
    explanation:
      "The unknown type is a type-safe counterpart of any. While variables of type any can have any value and allow any operations, variables of type unknown can have any value but you can't perform operations on them without first asserting or narrowing to a more specific type.",
    category: 'TypeScript Types',
    difficulty: 'medium',
  },
  {
    id: 'ts5',
    question: "What is a TypeScript 'generic'?",
    options: [
      'A type that can only be used once',
      'A placeholder type that allows you to create reusable components',
      'A type that can only be used with primitive values',
      'A special type for arrays',
    ],
    correctAnswer: 1,
    explanation:
      'Generics in TypeScript allow you to create reusable components that work with a variety of types rather than a single one. They act as placeholders for types that are specified when the component is used.',
    category: 'TypeScript Advanced',
    difficulty: 'medium',
  },
  {
    id: 'ts6',
    question: 'What is the purpose of the <code>readonly</code> modifier in TypeScript?',
    options: [
      'It makes a property visible only within its class',
      'It prevents a property from being modified after initialization',
      'It makes a property optional',
      'It ensures a property is initialized during declaration',
    ],
    correctAnswer: 1,
    explanation:
      'The readonly modifier in TypeScript prevents properties from being changed after they are initialized. Properties marked as readonly can only be assigned values when the object is first created.',
    category: 'TypeScript Modifiers',
    difficulty: 'medium',
  },
  {
    id: 'ts7',
    question: "What is a TypeScript 'union type'?",
    options: [
      'A type that combines multiple types into one',
      'A type that can only be used in unions',
      'A type that represents the intersection of two types',
      'A special type for combining arrays',
    ],
    correctAnswer: 0,
    explanation:
      "A union type in TypeScript is a type formed from two or more other types, representing values that may be any one of those types. It's written as Type1 | Type2 | Type3.",
    category: 'TypeScript Types',
    difficulty: 'easy',
  },
  {
    id: 'ts8',
    question: 'What is the purpose of the <code>keyof</code> operator in TypeScript?',
    options: [
      'To get all property names of an object as a union type',
      'To check if a key exists in an object',
      'To create a new key in an object',
      'To remove a key from an object',
    ],
    correctAnswer: 0,
    explanation:
      'The keyof operator in TypeScript takes an object type and produces a string or numeric literal union of its keys. This is useful for creating types that depend on the property names of another type.',
    category: 'TypeScript Advanced',
    difficulty: 'hard',
  },
  {
    id: 'ts9',
    question: "What is a TypeScript 'mapped type'?",
    options: [
      'A type that maps one value to another',
      'A way to transform one type into another by applying a transformation to each property',
      'A type that can only be used with maps',
      'A special type for key-value pairs',
    ],
    correctAnswer: 1,
    explanation:
      "Mapped types in TypeScript allow you to create new types based on old ones by transforming properties according to a pattern. They're a way to create transformed versions of existing types.",
    category: 'TypeScript Advanced',
    difficulty: 'hard',
  },
  {
    id: 'ts10',
    question: 'What is the purpose of the <code>never</code> type in TypeScript?',
    options: [
      'To indicate a value that will never occur',
      'To create infinite loops',
      'To disable type checking for a variable',
      'To mark deprecated code',
    ],
    correctAnswer: 0,
    explanation:
      "The never type in TypeScript represents values that never occur. It's used for functions that never return (e.g., functions that always throw exceptions or have infinite loops) and for variables that can never have a value due to type constraints.",
    category: 'TypeScript Types',
    difficulty: 'hard',
  },
];
