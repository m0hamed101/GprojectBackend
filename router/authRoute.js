const express = require('express')

// controller functions
const { loginUser, createUser,deleteuser,deleteMaterial,updateuser, AllUsers,getUser,addcourse, getcoursedetils, getallcourses,deletecourses} = require('../controller/userController')

const router = express.Router()

// createUser route
router.post('/createUser', createUser)

// updateuser route
router.post('/updateuser', updateuser)

// deleteUser route
router.delete('/deleteuser/:_id',deleteuser)
router.delete('/deletecourses/:_id',deletecourses)
router.delete('/deleteMaterial/:courseId/:materialId',deleteMaterial)

// login route
router.post('/login', loginUser)

// AllUsers
router.get('/allusers', AllUsers)

// getuser
router.get('/getuser/:_id', getUser)

// AddCourseToUser
router.post('/AddCourse',addcourse)

router.get('/getcoursedetils/:_id',getcoursedetils)
router.get('/getallCourse/:userId',getallcourses)




module.exports = router