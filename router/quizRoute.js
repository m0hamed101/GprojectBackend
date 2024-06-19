const express = require('express');
const router = express.Router();
const {
  fetchQuestions,
  incrementUserAttempts,
  submitQuiz,
  getQuiz,
  updateQuiz,
  addQuestion,
} = require('../controller/quizController');

// Route to fetch quiz questions
router.post('/fetchQuestions', fetchQuestions);

// Route to increment user attempts
router.post('/incrementUserAttempts', incrementUserAttempts);

// Route to submit the quiz
router.post('/submitQuiz', submitQuiz);

// Route to get quiz data (single quiz)
router.get('/:courseId/edit_quiz/:_id', getQuiz);

// Route to update quiz data
router.put('/:courseId/edit_quiz/:_id', updateQuiz);

// Route to add question to quiz
router.post('/:courseId/addQuestion', addQuestion);

module.exports = router;
