const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/sendEmail");

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
      data : userFound,
      data : token,
    });
  } else {
    res.status(400).json({
      message: "Invalid password",
    });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "please provide email",
    });
  }

  //check if that email is registered or not
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }
  //else send OTP to that email
  const otp = Math.floor(1000 + Math.random() * 9000);
  userExist[0].otp = otp;
  await userExist[0].save();

  await sendEmail({
    email: email,
    subject: "Your otp for DigiMOMO forgotPassword",
    message: ` Your otp is ${otp} . Don't Share with anyone`,
  });
  res.status(200).json({
    message: "OTP sent successfully",
  });
};

//verify otp
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide email,otp",
    });
  }
  //check if that otp is correct or not of that email
  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }
  if (userExists[0].otp !== otp) {
    res.status(400).json({
      message: "Invalid otp",
    });
  } else {
    //dispost otp so cannot be used next time
    userExists[0].otp = undefined;
    userExists[0].isOtpVerified = true;
    await userExists[0].save();

    res.status(201).json({
      message: "otp is correct",
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,newPassword,confirmPassword",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and confirmPassword doesn't matched",
    });
  }

  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(400).json({
      message: "User email not registered",
    });
  }

  if (userExists[0].isOtpVerified !== true) {
    return res.status(403).json({
      message: "You cannot perform this action",
    });
  }

  userExists[0].userPassword = bcrypt.hashSync(newPassword, 10);
  userExists[0].isOtpVerified = false;
  await userExists[0].save();

  res.status(200).json({
    message: "Password changed successfully",
  });
};
