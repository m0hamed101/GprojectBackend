const User = require('../module/authModule')
const Courses = require('../module/courseModule')
const userCourses = require('../module/usercourseModule')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// all Users
const AllUsers = async (req, res) => {
  try {
    const allusers = await User.find({})
    res.status(200).send(allusers)
  } catch (err) {
    res.status(404).send(err)
  }
}
// getUser
const getUser = async (req, res) => {
  // const USERID=req.body
  try {
    const getuser = await User.find(req.params)
    // .populate({populate: [{path: 'Course'}]})
    res.status(200).send(getuser)
  } catch (err) {
    res.status(404).send(err)
  }
}
// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// createUser
const createUser = async (req, res) => {
  const { name, id, year, email, password, permission } = req.body

  try {
    const user = await User.CreateUser(name, id, year, email, password, permission)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// deleteuser
const deleteuser = async (req, res) => {
  try {
    const itemId = req.params;
    await User.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deletecourses = async (req, res) => {
  try {
    const itemId = req.params;
    await Courses.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const deleteMaterial = async (req, res) => {
  try {
    const { courseId, materialId } = req.params;
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the index of the material in the materials array
    const materialIndex = course.materials.findIndex(material => material._id.toString() === materialId);
    if (materialIndex === -1) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Remove the material from the materials array
    course.materials.splice(materialIndex, 1);

    // Save the updated course
    await course.save();

    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
// updateuser
const updateuser = async (req, res) => {
  const { name, id, year, email, password, permission } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  try {
    const updatedItem = await User.findOneAndUpdate(
      { "id": id },
      {
        $set: {
          "name": name,
          "year": year,
          "email": email,
          "password": password,
          "permission": permission
        }
      },
      { new: true } // To return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedItem);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addcourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    let user = await userCourses.findOne({ "userid": userId });

    if (user) {
      // Check if the course is already added to the user
      const isCourseAlreadyAdded = user.courses.some(course => course.courseId.equals(courseId));

      if (isCourseAlreadyAdded) {
        return res.status(400).send({ message: "Course is already added" });
      } else {
        // Add the course to the user's courses array
        user.courses.push({ courseId });
        await user.save();
        return res.status(200).send({ message: "Course added successfully" });
      }
    } else {
      // If the user does not exist, create a new user with the given course
      user = await userCourses.create({ userid: userId, courses: [{ courseId }] });
      return res.status(200).send({ message: "Course added successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred" });
  }
};
const getallcourses = async (req, res) => {
  const { userId } = req.params;

  try {
    const usercourse = await userCourses.findOne({ "userid": userId }).populate({
      path: 'courses', populate: [{ path: 'courseId' }]
    })
    res.status(200).send(usercourse)
  } catch (err) {
    console.log(err);
  }
}
const getcoursedetils = async (req, res) => {
  try {
    // Destructure the 'user' property from the request body
    // const { user } = req.params;
    // console.log(user);

    // Use findOne if 'user' is an object with multiple criteria

    // const userCourse = await User.find(req.params).populate('UserCourses');
    const userCourse = await Courses.find(req.params)

    if (!userCourse) {
      // Return a 404 status if the user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the response with the populated user course data
    res.status(200).json(userCourse);
  } catch (err) {
    // Handle any errors and send an appropriate response
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = { createUser, loginUser, deleteuser, deletecourses,deleteMaterial, updateuser, AllUsers, getUser, addcourse, getcoursedetils, getallcourses }