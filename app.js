const express = require("express");
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel");
const app = express();

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//tell nodeJs to use dotenv
require("dotenv").config();

//nodeJs lai form bata ako data parser gar vaneko
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
connectDatabase();

//test api to check if server is live or not
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am alive",
  });
});

//register user api
app.post("/register", async(req, res) => {
    const { email,username, password, phoneNumber } = req.body;
    if (!email || !username || !password || !phoneNumber) {
        return res.status(400).json({
        message: "please provide email,userName,password,phoneNumber",
        });
    }

    //existing user
    const  userFound = await User.find({userEmail : email})
    if(userFound.length > 0){
        return res.status(400).json({
            message : "Already Registered Please Login"
        })
    }
    
    //else
    await User.create({
        userName : username,
        userEmail : email,
        userPhoneNumber : phoneNumber,
        userPassword : bcrypt.hashSync(password,10),
    })

    res.status(201).json({
        message : "User register sucessfully"
    })
});

//login user api
app.post("/login",async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message : "Please provide email and password"
        })
    }

    // check existing user
    const  userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
        return res.status(404).json({
            message : "User with that email is not Registered "
        })
    }

    //password check
    const isMatched = bcrypt.compareSync(password,userFound[0].userPassword)
    if(isMatched){
        //generate token
        const token = jwt.sign({id :  userFound[0]._id},process.env.SECRET_KEY,{
            expiresIn: "30d",
        })

         res.status(200).json({
            message : "User logged in successfully",
            token,
        })
    }else{
        res.status(400).json({
            message : "Invalid password"
        })
    }

})






const PORT = process.env.PORT;
//listen server
app.listen(PORT, () => {
  console.log(`Server has started at PORT ${PORT}`);
});
