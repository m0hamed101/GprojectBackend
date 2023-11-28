const express = require('express')

// controller functions
const { loginUser, createUser,deleteuser,updateuser, AllUsers,getUser,addcourse, getcourses } = require('../controller/userController')

const router = express.Router()

// createUser route
router.post('/createUser', createUser)

// updateuser route
router.post('/updateuser', updateuser)

// deleteUser route
router.delete('/deleteuser',deleteuser)

// login route
router.post('/login', loginUser)

// AllUsers
router.get('/allusers', AllUsers)

// getuser
router.get('/getuser/:_id', getUser)

// AddCourseToUser
router.post('/AddCourse',addcourse)

router.get('/getCourse/:_id',getcourses)




module.exports = router