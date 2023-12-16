const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

const { loginUser, registerUSer } = require("./controllers/auth/authController");

//ROUTES HERE
const authROute = require("./routes/auth/authRoute")

//Routes ends here



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


app.use("",authROute)    
//localhost:3000 /register  or
 //localhost:3000 /login

const PORT = process.env.PORT;
//listen server
app.listen(PORT, () => {
  console.log(`Server has started at PORT ${PORT}`);
});
