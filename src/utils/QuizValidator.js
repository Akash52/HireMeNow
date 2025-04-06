export class QuizValidator {
  validateQuestions(questions) {
    // Ensure all questions have required properties
    return questions.map((question, index) => {
      // Deep clone to avoid modifying original
      const validatedQuestion = { ...question };

      // Ensure question has an ID
      if (!validatedQuestion.id) {
        validatedQuestion.id = `q-${index}`;
      }

      // Ensure question has options
      if (!Array.isArray(validatedQuestion.options) || validatedQuestion.options.length < 2) {
        console.warn(`Question ${validatedQuestion.id} has insufficient options`);
        validatedQuestion.options = validatedQuestion.options || ['True', 'False'];
      }

      // Ensure correctAnswer is within range
      if (
        validatedQuestion.correctAnswer === undefined ||
        validatedQuestion.correctAnswer < 0 ||
        validatedQuestion.correctAnswer >= validatedQuestion.options.length
      ) {
        console.warn(`Question ${validatedQuestion.id} has invalid correctAnswer`);
        validatedQuestion.correctAnswer = 0;
      }

      return validatedQuestion;
    });
  }

  validateDifficulty(difficulty) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    return validDifficulties.includes(difficulty) ? difficulty : 'easy';
  }
}
