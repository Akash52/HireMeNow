const objectQuestions = [
  {
    id: 'js2',
    question:
      'Which method is used to add one or more elements to the end of an array and returns the new length of the array?',
    options: ['push()', 'pop()', 'concat()', 'join()'],
    correctAnswer: 0,
    explanation:
      'The <code>push()</code> method adds one or more elements to the end of an array and returns the new length of the array.',
    category: 'Arrays',
    difficulty: 'easy',
  },
  {
    id: 'js13',
    question: 'What is the purpose of the <code>Map</code> object in JavaScript?',
    options: [
      'To transform elements in an array',
      'To store key-value pairs and remember the original insertion order of the keys',
      'To create a visual map on a webpage',
      'To map one function to another function',
    ],
    correctAnswer: 1,
    explanation:
      'The Map object in JavaScript is a collection of key-value pairs where both the keys and values can be of any type. It remembers the original insertion order of the keys and offers better performance for frequent additions and removals compared to objects.',
    category: 'Data Structures',
    difficulty: 'medium',
  },
];

export default objectQuestions;
