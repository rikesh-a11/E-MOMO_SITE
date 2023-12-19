const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

const {
  loginUser,
  registerUSer,
} = require("./controllers/auth/authController");

//ROUTES HERE
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/product/productRoute");
const adminUserRoute = require("./routes/admin/adminUserRoute")
const userReviewRoute = require("./routes/user/userReviewRoute")

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

app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api",adminUserRoute);
app.use("/api",userReviewRoute);
//localhost:3000 /register  or
//localhost:3000 /login
//yt ma chai-> app.use("/api/v1/")

//telling nodeJs to give access to uploads folder only
app.use(express.static("./uploads"));

const PORT = process.env.PORT;
//listen server
app.listen(PORT, () => {
  console.log(`Server has started at PORT ${PORT}`);
});
