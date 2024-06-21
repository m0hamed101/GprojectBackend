const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quizUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [{
    question: { type: String },
    userAnswer: { type: String },
    score: { type: Number,default: 0  }
  }],
  // total_score: { type: Number,default: 0 },
  userAttempts: { type: Number,default: 0 },
});

const QuizUser = mongoose.model('QuizUser', quizUserSchema);
module.exports = QuizUser;
