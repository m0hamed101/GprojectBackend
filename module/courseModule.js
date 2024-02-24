const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: { type: String, required: true },
    DocName: { type: String, required: true },
    ImageURL: { type: String, required: true },
    materials: [
        {
            title: { type: String, required: true },
            description: { type: String },
            type: {type: String,enum: ["lecture", "quiz", "assignment"],required: true},
            fileLink: { type: String, required: true },
            // uploadedBy: { type: String, required: true },
            // uploadedAt: { type: Date, default: Date.now },
            // lectureDetails: {duration: { type: Number, required: function () { return this.type === "lecture"; } }},
            quizDetails: {
                questions: { type: [String] },
                // questions: { type: [String], required: function () { return this.type === "quiz"; } },
                timeLimit: { type: Number }
            },
            assignmentDetails: {
                dueDate: { type: Date },
                maxPoints: { type: Number }
            }
        }
    ]
});


const Courses= mongoose.model('Courses', courseSchema);
module.exports =Courses

