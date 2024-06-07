const mongoose = require("mongoose");
const Course = require("../module/courseModule");
const QuizUser = require("../module/quizuser");

// Function to fetch quiz questions
const fetchQuestions = async (req, res) => {
  const { courseId, userId, quizId } = req.body;
  
  try {
    // Check if the provided IDs are valid ObjectId values
    if (!mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Find the quiz details within the course materials
    const quizDetails = course.materials.find(material => 
      material._id.toString() === quizId && material.type === "quiz");

    // Check if quizDetails is found
    if (!quizDetails) return res.status(404).json({ error: "Quiz not found" });

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
        userAttempts: 0 // Start with 0 attempts
      });

      await quizUser.save();
    }

    // Fetch all quiz data
    const allQuizData = {
      quizDetails,
      score: quizUser.score,
      userAttempts: quizUser.userAttempts
      // Add any other relevant data here
    };

    // Return all quiz data
    res.status(200).json(allQuizData);
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to increment user attempts
const incrementUserAttempts = async (req, res) => {
  const { courseId, userId, quizId } = req.body;
  
  try {
    // Check if the provided IDs are valid ObjectId values
    if (!mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid ID format" });
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
    console.error("Error incrementing user attempts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to submit the quiz
const submitQuiz = async (req, res) => {
  const { courseId, userId, quizId, answers, score } = req.body;
  
  try {
    // Check if the provided IDs are valid ObjectId values
    if (!mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find and update QuizUser with answers and score
    let quizUser = await QuizUser.findOneAndUpdate(
      { courseId, userId, quizId },
      { answers, score },
      { new: true }
    );

    // Return updated quizUser
    res.status(200).json({ message: "Quiz submitted successfully", quizUser });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fetchQuestions, incrementUserAttempts, submitQuiz };
