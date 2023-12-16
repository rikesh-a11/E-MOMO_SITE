const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user
exports.registerUSer = async (req, res) => {
  const { email, username, password, phoneNumber } = req.body;
  if (!email || !username || !password || !phoneNumber) {
    return res.status(400).json({
      message: "please provide email,userName,password,phoneNumber",
    });
  }

  //existing user
  const userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "Already Registered Please Login",
    });
  }

  //else
  await User.create({
    userName: username,
    userEmail: email,
    userPhoneNumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 10),
  });

  res.status(201).json({
    message: "User register sucessfully",
  });
};

//login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  // check existing user
  const userFound = await User.find({ userEmail: email });
  if (userFound.length == 0) {
    return res.status(404).json({
      message: "User with that email is not Registered ",
    });
  }

  //password check
  const isMatched = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatched) {
    //generate token
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } else {
    res.status(400).json({
      message: "Invalid password",
    });
  }
};
