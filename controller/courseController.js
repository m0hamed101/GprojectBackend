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


const addLectureToCourse = async (req, res) => {
    try {
        const { course_id, lectureDetails } = req.body;

        // Find the course by name
        let course = await Course.findOne({_id:course_id} );

        // If the course doesn't exist, return an error
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Add the new lecture to the materials array of the existing course
        course.materials.push({
            title: lectureDetails.title,
            description: lectureDetails.description,
            type:lectureDetails.type,
            fileLink: lectureDetails.fileLink,
            // lectureDetails: {
            //     duration: lectureDetails.duration,
            // },
        });

        // Save the course with the new lecture
        await course.save();

        res.status(201).json({ message: 'Lecture added to the course successfully', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};





module.exports = { CreateCourse, allCourse,addLectureToCourse }