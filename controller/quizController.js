const mongoose = require('mongoose');
const Course = require('../module/courseModule');
const QuizUser = require('../module/quizuser');

// Function to fetch quiz questions
const fetchQuestions = async (req, res) => {
  const { courseId, userId, quizId } = req.body;

  try {
    // Check if the provided IDs are valid ObjectId values
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find the quiz details within the course materials
    const quizDetails = course.materials.find(
      (material) =>
        material._id.toString() === quizId && material.type === 'quiz'
    );

    // Check if quizDetails is found
    if (!quizDetails) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Find or create QuizUser
    let quizUser = await QuizUser.findOne({ courseId, userId, quizId });

    // If quizUser is not found, create a new one
    if (!quizUser) {
      quizUser = new QuizUser({
        userId,
        courseId,
        quizId,
        answers: [],
        score: 0,
        userAttempts: 0, // Start with 0 attempts
      });

      await quizUser.save();
    }

    // Fetch all quiz data
    const allQuizData = {
      quizDetails,
      score: quizUser.score,
      userAttempts: quizUser.userAttempts,
      timeLimitMinutes: quizDetails.quizDetails.timeLimitMinutes,
      maxAttempts: quizDetails.quizDetails.maxAttempts,
      // Add any other relevant data here
    };

    // Return all quiz data
    res.status(200).json(allQuizData);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to increment user attempts
const incrementUserAttempts = async (req, res) => {
  const { courseId, userId, quizId } = req.body;

  try {
    // Check if the provided IDs are valid ObjectId values
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find or create QuizUser
    let quizUser = await QuizUser.findOneAndUpdate(
      { courseId, userId, quizId },
      { $inc: { userAttempts: 1 } }, // Increment user attempts
      { new: true, upsert: true } // Create new if not found
    );

    // Return updated quizUser
    res.status(200).json({ userAttempts: quizUser.userAttempts });
  } catch (error) {
    console.error('Error incrementing user attempts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to submit the quiz
const submitQuiz = async (req, res) => {
  const { courseId, userId, quizId, answers, score } = req.body;

  try {
    // Check if the provided IDs are valid ObjectId values
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find and update QuizUser with answers and score
    let quizUser = await QuizUser.findOneAndUpdate(
      { courseId, userId, quizId },
      { answers, score },
      { new: true }
    );

    // Return updated quizUser
    res.status(200).json({ message: 'Quiz submitted successfully', quizUser });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to add question to quiz
const addQuestion = async (req, res) => {
  const { courseId } = req.params;
  const { quizId, question, type, options, rightAnswer } = req.body;

  try {
    // Check if the provided courseId is a valid ObjectId value
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the quiz details within the course materials
    const quizDetails = course.materials.find(
      (material) =>
        material._id.toString() === quizId && material.type === 'quiz'
    );

    // Check if quizDetails is found
    if (!quizDetails) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Prepare the new question object based on the type
    let newQuestion;
    if (type === 'MCQ') {
      newQuestion = {
        question,
        type,
        options: options.map((option) => ({ option })),
        right_answer: rightAnswer,
      };
    } else if (type === 'ANSWER') {
      newQuestion = {
        question,
        type,
        right_answer: rightAnswer,
      };
    } else {
      return res.status(400).json({ error: 'Invalid question type' });
    }

    // Add question to the quiz details
    quizDetails.quizDetails.questions.push(newQuestion);

    await course.save();

    res.status(201).json(quizDetails.quizDetails.questions[quizDetails.quizDetails.questions.length - 1]);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get quiz data
const getQuiz = async (req, res) => {
  try {
    const { courseId, _id } = req.params;
    const course = await Course.findById(courseId);
   
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const material = course.materials.id(_id);
    if (!material || material.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to update quiz data
const updateQuiz = async (req, res) => {
  try {
    const { courseId, _id } = req.params;
    const { quizData } = req.body;

    console.log('Updating quiz with courseId:', courseId, 'and _id:', _id);
    console.log('Received quizData:', quizData);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let material = course.materials.id(_id);
    if (!material || material.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz details
    if (quizData.title) material.title = quizData.title;
    if (quizData.description) material.description = quizData.description;
    if (quizData.quizDetails) {
      if (quizData.quizDetails.timeLimitMinutes !== undefined) {
        material.quizDetails.timeLimitMinutes = quizData.quizDetails.timeLimitMinutes;
      }
      if (quizData.quizDetails.maxAttempts !== undefined) {
        material.quizDetails.maxAttempts = quizData.quizDetails.maxAttempts;
      }
      if (quizData.quizDetails.questions) {
        material.quizDetails.questions = quizData.quizDetails.questions;
      }
      if (quizData.quizDetails.deadline) {
        material.quizDetails.deadline = new Date(quizData.quizDetails.deadline); // Convert to Date object
      }
    }

    await course.save();

    // Return updated quiz material
    res.json({
      ...material.toObject(),
      deadline: material.quizDetails.deadline // Return the updated deadline here
    });
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  fetchQuestions,
  incrementUserAttempts,
  submitQuiz,
  addQuestion,
  getQuiz,
  updateQuiz,
};
