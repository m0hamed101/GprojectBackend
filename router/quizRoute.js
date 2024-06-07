const express = require('express');
const router = express.Router();
const { fetchQuestions, incrementUserAttempts, submitQuiz } = require('../controller/quizController');

router.post('/fetchQuestions', fetchQuestions);
router.post('/incrementUserAttempts', incrementUserAttempts);
router.post('/submitQuiz', submitQuiz);

module.exports = router;
