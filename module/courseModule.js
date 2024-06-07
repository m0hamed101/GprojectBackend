const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseName: { type: String, required: true },
  DocName: { type: String, required: true },
  ImageURL: { type: String, required: true },
  materials: [{
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["lecture", "quiz", "assignment"], required: true },
    fileLink: { type: String },
    quizDetails: {
      type: {
        questions: [{
          question: { type: String, required: true },
          type: { type: String, enum: ["MCQ", "ANSWER"], required: true },
          options: [{
            option: { type: String }
          }],
          right_answer: { type: String, required: true },
          points: { type: Number, required: true }
        }],
        timeLimitMinutes: { type: Number, default: 300 },
        maxAttempts: { type: Number, default: 1 }
      },
      required: function() { return this.type === "quiz"; }
    },
    assignmentDetails: {
      dueDate: { type: Date, default: Date.now },
      maxPoints: { type: Number, default: 0},
      user_details: [{
        id: { type:String},
        username: { type: String},
        user_score: { type:Number, default: 0},
        filelink: { type: String },
      }]
    }
  }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
