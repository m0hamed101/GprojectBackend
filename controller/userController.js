const User = require('../module/authModule')
const Courses = require('../module/courseModule')
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

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// deleteuser
const deleteuser = async (req, res) => {
  const { userid } = req.body
  try {
    const deletedItem = await User.findOneAndDelete(userid)
    if (!deletedItem) {
      res.status(404).send({ error: "Item not found" })
    }
    // res.send(deletedItem)
    res.send("done")
  } catch (error) {
    res.status(400).send(error)
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
  // console.log(userId, courseId);

  try {
    // Check if the user already has the course in their profile
    const user = await User.findOne({ "_id": userId, "UserCourses": courseId });

    // Check if the course exists
    const course = await Courses.findOne({ "_id": courseId });

    // If the course is not found, return an error
    if (!course) {
      res.status(404).send({ message: "Course not found" });
      return;
    }

    // If the user already has the course, return an error
    if (user) {
      res.status(400).send({ message: "Course is already added" });
      return;
    }

    // Add the course to the user's profile
    await User.findOneAndUpdate(
      { "_id": userId },
      { $push: { UserCourses: courseId } },
      { new: true }
    );

    // No need to call save() after findOneAndUpdate

    res.status(200).send({ message: "Course added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
};


// const getcourses = async (req, res) => {
//   try {
//     // Destructure the 'user' property from the request body
//     const { user } = req.body;
//     console.log(user);

//     // Use findOne if 'user' is an object with multiple criteria
//     const userCourse = await User.findOne({"_id":user}).populate('UserCourses')
//     // .populate({
//     //   // path: 'user',
//     //   path: 'user',
//     //   populate: [{
//     //     path: 'UserCourses'
//     //   }]
//     // });
//     // console.log(userCourse);
//     res.status(200).send(userCourse.UserCourses)

//     if (!userCourse) {
//       // Return a 404 status if the user is not found
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Assuming 'UserCourses' is a reference to courses in the User model
//     // You may want to populate the courses based on your schema
//     // For simplicity, I'm assuming that 'UserCourses' is the field containing the course IDs
//     // const populatedUserCourse = await userCourse.populate('UserCourses').execPopulate();

//     // Send the response with the populated user course data
//     res.status(200).json({ message: populatedUserCourse });
//   } catch (err) {
//     // Handle any errors and send an appropriate response
//     console.error(err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


const getcourses = async (req, res) => {
  try {
    // Destructure the 'user' property from the request body
    // const { user } = req.params;
    // console.log(user);

    // Use findOne if 'user' is an object with multiple criteria
    
    const userCourse = await User.find(req.params).populate('UserCourses');

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



// const getcourses = async (req, res) => {
//   try {
//     const { user } = req.body
//       const usercourse=await User.find(user)
//       res.status(200).json({ message: usercourse });
//   } catch (err) {
//     res.status(404).send(err)
//   }
// }





// const addcourse = async (req, res) => {
//   const { userId, courseId } = req.body;

//   try {
//     const user = await User.find({ _id: userId });
//     const course = await Courses.find({ _id: courseId });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Check if the course is already added to the user's profile
//     if (user.UserCourses.includes(course)) {
//       return res.status(400).json({ message: "Course is already added" });
//     }

//     // Add the course to the user's profile
//     user.UserCourses.push(course);
//     await user.save();

//     return res.status(200).json({ message: "Course added successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// };




module.exports = { createUser, loginUser, deleteuser, updateuser, AllUsers, getUser, addcourse, getcourses }