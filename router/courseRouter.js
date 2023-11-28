const express=require('express')
const router =express.Router()

const{CreateCourse,allCourse}=require('../controller/courseController')

// create Course router
router.post('/createcourse',CreateCourse)
router.get('/allcourse',allCourse)
module.exports=router
