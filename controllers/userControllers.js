const User = require("../models/userModel");

// signup student
const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      contact,
      DOB,
      password,
      confirmPassword,
      classNumber,
    } = req.body;
    const role = "student";

    // Check if the email already exists
    const existingUser = await User.findOne({ email }).select("-password");
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists! Please check." });
    }

    let errors = [];

    // Convert classNumber to an array if provided
    let classNumbers = classNumber
      ? Array.isArray(classNumber)
        ? classNumber
        : [classNumber]
      : [];

    // Validate classNumber
    if (!classNumber) {
      errors.push("classNumber is required.");
    } else if (classNumbers.length !== 1) {
      errors.push("Only one classNumber is allowed.");
    } else {
      const num = parseInt(classNumbers[0]); // Convert to integer for validation
      if (isNaN(num)) {
        errors.push("classNumber must be a number.");
      } else if (num < 1 || num > 12) {
        errors.push("classNumber must be a number between 1 and 12.");
      }
    }

    // If there are any errors, return them
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    // Check if the class exists
    const classObj = await Class.findOne({ classNumber: classNumber });
    if (!classObj) {
      return res
        .status(400)
        .json({ message: `Class with classNumber ${classNumber} not found.` });
    }

    let studentSubject = []; // Initialize studentSubject as an empty string

    // If classNumber is between 1 and 10, assign subjects
    if (parseInt(classNumber) >= 1 && parseInt(classNumber) <= 10) {
      studentSubject = classObj.subjects;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      regDate: new Date(),
      fullName: fullName,
      password: hashedPassword,
      email: email,
      contact: contact,
      DOB: DOB,
      role: role,
      classNumber: classNumber,
      subjects: studentSubject,
    });

    // Save the new user
    await newUser.save();

    // Assign the student to the class
    classObj.students.push(newUser._id);
    classObj.totalStudents = classObj.students.length; // Count total students
    await classObj.save();

    // Creating a user object without the password field
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;
    delete userWithoutPassword.updatedAt;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("name", name);
    console.log("email", email);

    if (!name) {
      return res.status(400).json({ message: "please enter your name . " });
    }

    const newUser = new User({
      name: name,
      email: email,
    });

    // Save the new user
    await newUser.save();
    return res.status(200).json({ message: "data entered sucessfully. " });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
    try {
        // const {name} = req.body
      const foundUser = await User.find(); 
      if (!foundUser || foundUser.length === 0) { 
        return res.status(400).json({ message: "No users found" });
      }
      return res.status(200).json({ message: "Found users are:", foundUser }); 
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const deleteUser = async (req, res) => {
    try {
        const {name} = req.body
      const foundUser = await User.findOneAndDelete({name: name}); 
      console.log("foundUser", foundUser);
      if (!foundUser || foundUser.length === 0) { 
        return res.status(400).json({ message: "No users found" });
      }
      return res.status(200).json({ message: "deleted user :", foundUser }); 
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports = { registerUser , getUser, deleteUser};
