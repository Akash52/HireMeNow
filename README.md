# HireMeNow
https://hiremenow-dev.netlify.app/
HireMeNow is a comprehensive interview preparation platform designed to help developers prepare for technical interviews through interactive quizzes and structured learning materials.

![HireMeNow Screenshot](https://i.ibb.co/FLKCPKdQ/Screenshot-from-2025-04-05-21-19-16.png)

## Features

- **Interactive Quiz Mode** - Test your knowledge with curated questions on:
  - JavaScript
  - TypeScript
  - React
  - Node.js
  - HTML/CSS
  - Algorithms

- **Interview Preparation** - Browse comprehensive guides on:
  - JavaScript fundamentals
  - Algorithmic problems
  - System design concepts
  - Behavioral interview questions

- **Multiple Difficulty Levels** - Practice with Easy, Medium, and Hard questions

- **Performance Tracking** - Monitor your progress and identify areas for improvement

- **Offline Support** - Study even without an internet connection

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/HireMeNow.git
   cd HireMeNow
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Access the application at `http://localhost:5173`

## Code Quality and CI/CD

HireMeNow uses GitHub Actions for continuous integration and deployment:

- **Linting**: Automatically checks code style and quality
- **Testing**: Runs test suite on every push and pull request
- **Building**: Creates production builds for deployment
- **Deployment**: Automatically deploys to GitHub Pages when merged to main

### Running Quality Checks Locally

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run tests
npm test

# Build the project
npm run build
```

## Usage

### Quiz Mode

1. Select a programming topic (JavaScript, TypeScript, etc.)
2. Choose difficulty level (Easy, Medium, Hard)
3. Click "Start Quiz" to begin
4. Answer questions within the time limit
5. View your results and export them if desired

### Interview Preparation

1. Click the "Interview Prep" tab in the top navigation
2. Browse topics in the left sidebar
3. Click on any question to view detailed answers and tips
4. Mark questions as completed to track your progress
5. Use the search bar to find specific topics or questions

## Project Structure

```
├── public/               # Static assets
├── src/
│   ├── analytics/        # Analytics functionality
│   ├── assets/           # Icons and images
│   ├── core/             # Core quiz functionality
│   ├── interactions/     # User interaction handlers
│   ├── interview/        # Interview preparation module
│   ├── questions/        # Question databases by topic
│   ├── ui/               # UI components and helpers
│   ├── utils/            # Utility functions
│   ├── main.js           # Application entry point
│   ├── tailwind.css      # CSS styles
│   └── uiManager.js      # UI state management
├── index.html            # Main HTML file
├── package.json          # Project dependencies
└── .github/
    └── workflows/        # CI/CD configurations
```

## Contributing

We welcome contributions to HireMeNow! Here's how you can help:

### Adding New Questions

1. Navigate to the appropriate question file in `src/questions/` (e.g., `javascript.js` for JavaScript questions)

2. Add your question following the existing format:

```javascript
{
  id: "unique-id",
  question: "Your question text here",
  options: [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  correctAnswer: 0, // Index of correct option (0-based)
  explanation: "Explanation of why this is the correct answer",
  category: "Category Name",
  difficulty: "easy" // easy, medium, or hard
}
```

3. For interview questions, add them to the appropriate topic in `src/interview/QuestionDatabase.js`:

```javascript
{
  question: 'Your interview question',
  answer: 'A comprehensive answer to the question',
  tips: [
    'Tip 1 for answering this question',
    'Tip 2 for answering this question',
    'Additional context or advice'
  ]
}
```

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request
6. Wait for the CI/CD pipeline to verify your changes
7. Address any issues found by the automated checks

### Code Style Guidelines

- Follow existing code style and formatting
- Use meaningful variable and function names
- Include comments for complex logic
- Write unit tests for new functionality when appropriate

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped improve HireMeNow
- Built with [Tailwind CSS](https://tailwindcss.com/)
- Uses [highlight.js](https://highlightjs.org/) for code syntax highlighting
