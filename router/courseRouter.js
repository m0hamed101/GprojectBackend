const express = require('express');
const router = express.Router();
const {
    createCourse,
    addLectureToCourse,
    getAssignmentById,
    uploadUserDetails,
    updateScore,
    deleteUserDetails,getAllCourses
} = require('../controller/courseController');

// Create a new course
router.post('/createcourse', createCourse);
router.get('/allcourse', getAllCourses);

// Add a lecture to a course
router.post('/addLectureToCourse', addLectureToCourse);

// Get assignment details by course ID and assignment ID
router.get('/:courseId/assignments/:assignmentId', getAssignmentById);

// Upload user details for an assignment
router.post('/:courseId/assignments/:assignmentId/upload', uploadUserDetails);

// Update user score for an assignment
router.put('/:courseId/assignments/:assignmentId/user-details/:userId', updateScore);

// Delete user details for an assignment
router.delete('/:courseId/assignments/:assignmentId/user-details/:userId', deleteUserDetails);

module.exports = router;
