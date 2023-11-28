const Course = require('../module/courseModule')

const allCourse = async (req, res) => {
    try {
        const allcourse = await Course.find({})
        res.status(200).send(allcourse)
    } catch (err) {
        res.status(404).send(err)
    }
}

const CreateCourse = async (req, res) => {
    const { courseName, DocName, ImageURL } = req.body;
    try {
        // Create a new course document
        const newCourse = new Course({
            courseName,
            DocName,
            ImageURL,
        });

        // Save the new course to the database
        await newCourse.save();

        // Respond with a success message or the created course
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the course' });
    }
};
module.exports = { CreateCourse,allCourse }