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
      questions: [{
        question: { type: String, required: function () { return this.type === "quiz"; } },
        type: { type: String, enum: ["MCQ", "ANSWER"] },
        options: {
          type: [{
            option: { type: String }
          }],
          validate: {
            validator: function () {
              return this.type === "MCQ" ? this.options.length === 4 : true;
            },
            message: 'Four options are required for MCQ type questions.'
          }
        },
        answer: { type: String, required: function () { return this.type === "quiz"; } },
        points: { type: Number, required: function () { return this.type === "quiz"; } }
      }],
      timeLimitMinutes: { type: Number,default:300 },
      maxAttempts: { type: Number,default:1 }
    },
    assignmentDetails: {
      dueDate: { type: Date },
      maxPoints: { type: Number }
    }
  }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
