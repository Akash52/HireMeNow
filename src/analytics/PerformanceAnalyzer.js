export class PerformanceAnalyzer {
  generateAnalysis(questions, userAnswers, quizType, difficulty) {
    // Use memoization for performance with larger datasets
    const memoizedData = {
      categories: new Map(),
      correctByTime: [],
      incorrectByTime: [],
      totalTime: 0,
    };

    // Process user answers once
    userAnswers.forEach((answer) => {
      const question = questions[answer.questionIndex];
      if (!question) return;

      // Ensure timeSpent is a valid number
      const timeSpent =
        typeof answer.timeSpent === 'number' && !isNaN(answer.timeSpent) ? answer.timeSpent : 0;

      const category = question.category || 'general';
      if (!memoizedData.categories.has(category)) {
        memoizedData.categories.set(category, { total: 0, correct: 0 });
      }

      const categoryData = memoizedData.categories.get(category);
      categoryData.total++;
      if (answer.isCorrect) {
        categoryData.correct++;
        memoizedData.correctByTime.push(timeSpent);
      } else {
        memoizedData.incorrectByTime.push(timeSpent);
      }

      memoizedData.totalTime += timeSpent;
    });

    // Convert map to object for easier template rendering
    const categoryStats = {};
    memoizedData.categories.forEach((data, category) => {
      categoryStats[category] = data;
    });

    // Calculate performance metrics with safety checks
    const totalAnswers = Math.max(1, userAnswers.length);
    const averageTimePerQuestion = Math.round(memoizedData.totalTime / totalAnswers);

    // Handle empty arrays properly
    const averageTimeCorrect =
      memoizedData.correctByTime.length > 0
        ? Math.round(
            memoizedData.correctByTime.reduce((sum, time) => sum + time, 0) /
              memoizedData.correctByTime.length
          )
        : 0;

    const averageTimeIncorrect =
      memoizedData.incorrectByTime.length > 0
        ? Math.round(
            memoizedData.incorrectByTime.reduce((sum, time) => sum + time, 0) /
              memoizedData.incorrectByTime.length
          )
        : 0;

    // Identify weak and strong areas
    const weakAreas = [];
    const strongAreas = [];

    memoizedData.categories.forEach((data, category) => {
      const performance = data.total > 0 ? data.correct / data.total : 0;
      if (performance < 0.6 && data.total >= 2) {
        weakAreas.push(category);
      } else if (performance > 0.8 && data.total >= 2) {
        strongAreas.push(category);
      }
    });

    // Safely calculate min/max times
    let quickestAnswer = Infinity;
    let slowestAnswer = 0;

    userAnswers.forEach((answer) => {
      if (typeof answer.timeSpent === 'number' && !isNaN(answer.timeSpent)) {
        if (answer.timeSpent > 0 && answer.timeSpent < quickestAnswer) {
          quickestAnswer = answer.timeSpent;
        }
        if (answer.timeSpent > slowestAnswer) {
          slowestAnswer = answer.timeSpent;
        }
      }
    });

    // Handle edge cases
    if (quickestAnswer === Infinity) quickestAnswer = 0;

    return {
      averageTimePerQuestion,
      averageTimeCorrect,
      averageTimeIncorrect,
      categoryPerformance: categoryStats,
      weakAreas,
      strongAreas,
      quizType,
      difficulty,
      unansweredQuestions: userAnswers.filter((a) => a.userAnswer === -1).length,
      quickestAnswer: Math.round(quickestAnswer),
      slowestAnswer: Math.round(slowestAnswer),
    };
  }
}
