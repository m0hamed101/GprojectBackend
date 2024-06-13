const Course = require('../module/courseModule');

// Create a new course
const createCourse = async (req, res) => {
    const { courseName, DocName, ImageURL, materials } = req.body;
    try {
        const newCourse = new Course({
            courseName,
            DocName,
            ImageURL,
            materials,
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the course' });
    }
};

// Add a lecture to a course
const addLectureToCourse = async (req, res) => {
    try {
        const { course_id, lectureDetails } = req.body;
        let course = await Course.findOne({ _id: course_id });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.materials.push({
            title: lectureDetails.title,
            description: lectureDetails.description,
            type: lectureDetails.type,
            fileLink: lectureDetails.fileLink,
        });

        await course.save();
        res.status(201).json({ message: 'Lecture added to the course successfully', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get assignment details by course ID and assignment ID
const getAssignmentById = async (req, res) => {
    const { courseId, assignmentId } = req.params;

    try {
        const course = await Course.findOne({
            _id: courseId,
            'materials._id': assignmentId,
            'materials.type': 'assignment',
        });

        if (!course) {
            return res.status(404).json({ msg: 'Course or assignment not found' });
        }

        const assignment = course.materials.find(
            material => material._id.toString() === assignmentId && material.type === 'assignment'
        );

        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Upload user details for an assignment
const uploadUserDetails = async (req, res) => {
    const { userId, username, fileLink, userScore } = req.body;
    const { courseId, assignmentId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const assignment = course.materials.find(a => a._id.toString() === assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const userDetails = {
            id: userId,
            username,
            user_score: userScore,
            filelink: fileLink
        };

        assignment.assignmentDetails.user_details.push(userDetails);
        await course.save();

        res.status(201).json({ message: 'User details saved successfully' });
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user score for an assignment
const updateScore = async (req, res) => {
    const { courseId, assignmentId, userId } = req.params;
    const { userScore } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const assignment = course.materials.find(a => a._id.toString() === assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const userDetails = assignment.assignmentDetails.user_details.find(u => u.id.toString() === userId);
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        userDetails.user_score = userScore;
        await course.save();

        res.status(200).json({ message: 'User score updated successfully' });
    } catch (error) {
        console.error('Error updating user score:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user details for an assignment
const deleteUserDetails = async (req, res) => {
    const { courseId, assignmentId, userId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const assignment = course.materials.find(a => a._id.toString() === assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const initialLength = assignment.assignmentDetails.user_details.length;
        assignment.assignmentDetails.user_details = assignment.assignmentDetails.user_details.filter(
            userDetail => userDetail.id.toString() !== userId
        );

        if (assignment.assignmentDetails.user_details.length === initialLength) {
            return res.status(404).json({ message: 'User detail not found' });
        }

        await course.save();

        res.status(200).json({ message: 'User detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting user detail:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createCourse,
    addLectureToCourse,
    getAssignmentById,
    uploadUserDetails,
    updateScore,
    deleteUserDetails,
    getAllCourses,
};
