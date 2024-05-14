const express = require('express');
const router = express.Router();
const { fetchQuestions } = require('../controller/quizController');

router.get('/fetchQuestions', fetchQuestions);

module.exports = router;
