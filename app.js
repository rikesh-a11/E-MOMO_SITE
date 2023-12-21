const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

//ROUTES HERE
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/product/productRoute");
const adminUserRoute = require("./routes/admin/adminUserRoute")
const userReviewRoute = require("./routes/user/userReviewRoute")
const profileRoute = require("./routes/user/profileRoute")
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

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin",adminUserRoute);
app.use("/api/reviews",userReviewRoute);
app.use("/api/profile",profileRoute);
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
