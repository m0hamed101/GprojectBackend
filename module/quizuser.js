const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quizUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [{
    question: { type: String, required: true },
    userAnswer: { type: String },
    correctAnswer: { type: String }
  }],
  score: { type: Number,default: 1 },
  userAttempts: { type: Number,default: 1 },
});

const QuizUser = mongoose.model('QuizUser', quizUserSchema);
module.exports = QuizUser;
