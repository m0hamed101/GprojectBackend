const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usercourseSchema = new Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // courseid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
    // courses: [{courseId: {type: mongoose.Schema.Types.ObjectId,ref: 'products',required: true}}]});
    courses: [{courseId: {type: mongoose.Schema.Types.ObjectId,ref: 'Course',required: true}}]});
const userCourses= mongoose.model('userCourses', usercourseSchema);
module.exports =userCourses
