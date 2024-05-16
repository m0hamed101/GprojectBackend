const express = require('express');
const router = express.Router();
const { fetchQuestions } = require('../controller/quizController');

router.post('/fetchQuestions', fetchQuestions);

module.exports = router;
