const mongoose = require("mongoose");
const Course = require("../module/courseModule");
const QuizUser = require("../module/quizuser");
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

    // Return quizDetails
    res.status(200).json({ quizDetails });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { fetchQuestions };
