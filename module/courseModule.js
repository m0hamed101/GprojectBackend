const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: { type: String, required: true },
    DocName: { type: String, required: true },
    ImageURL:{type:String,required:true},
    // materal:{type:Array,}

});
const Courses= mongoose.model('Courses', courseSchema);
module.exports =Courses
