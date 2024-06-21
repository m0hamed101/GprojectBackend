const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String },
  DocName: { type: String },
  ImageURL: { type: String },
  materials: [{
    title: { type: String },
    description: { type: String },
    type: { type: String, enum: ["lecture", "quiz", "assignment"] },
    fileLink: { type: String },
    quizDetails: {
      questions: [{
        question: { type: String },
        type: { type: String, enum: ["MCQ", "ANSWER", "SOUND", "FILE"] },
        options: [{
          option: { type: String }
        }],
        right_answer: { type: String }
      }],
      timeLimitMinutes: { type: Number, default: 300 },
      deadline: { type: Date },
      maxAttempts: { type: Number, default: 1 }
    },
    assignmentDetails: {
      dueDate: { type: Date,default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // one week from now
      },
      maxPoints: { type: Number, default: 0 },
      user_details: [{
        id: { type: String },
        username: { type: String },
        user_score: { type: Number, default: 0 },
        filelink: { type: String },
      }]
    }
  }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

