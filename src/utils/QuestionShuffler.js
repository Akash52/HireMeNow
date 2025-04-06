export class QuestionShuffler {
  shuffle(questions, difficulty) {
    // Make a copy to avoid mutations
    const questionsCopy = [...questions];

    // Fisher-Yates shuffle algorithm for questions
    for (let i = questionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }

    // For each question, also shuffle its options and adjust the correct answer index
    const shuffledQuestions = questionsCopy.map((question) => {
      // Create a deep copy of the question
      const shuffledQuestion = JSON.parse(JSON.stringify(question));

      // Create an array of option indices paired with the options
      const optionsWithIndices = shuffledQuestion.options.map((option, index) => ({
        originalIndex: index,
        option,
      }));

      // Shuffle the options
      for (let i = optionsWithIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndices[i], optionsWithIndices[j]] = [
          optionsWithIndices[j],
          optionsWithIndices[i],
        ];
      }

      // Update the options array with shuffled options
      shuffledQuestion.options = optionsWithIndices.map((item) => item.option);

      // Update the correct answer index to match the new position of the correct option
      const correctOptionOriginalIndex = shuffledQuestion.correctAnswer;
      shuffledQuestion.correctAnswer = optionsWithIndices.findIndex(
        (item) => item.originalIndex === correctOptionOriginalIndex
      );

      return shuffledQuestion;
    });

    // Determine question limit based on difficulty
    const maxQuestions = {
      easy: 10,
      medium: 15,
      hard: 20,
    };

    const limit = maxQuestions[difficulty] || 10;

    return {
      shuffled: shuffledQuestions,
      limit,
    };
  }
}
