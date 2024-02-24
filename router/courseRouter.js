const express=require('express')
const router =express.Router()

const{CreateCourse,allCourse,addLectureToCourse}=require('../controller/courseController')

// create Course router
router.post('/createcourse',CreateCourse)
router.post('/addLectureToCourse',addLectureToCourse)
router.get('/allcourse',allCourse)
module.exports=router
