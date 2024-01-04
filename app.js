const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();
// const bcrypt = require("bcryptjs")

// const {Server} = require("socket.io")
const cors = require("cors")

//ROUTES HERE
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/product/productRoute");
const adminUserRoute = require("./routes/admin/adminUserRoute");
const userReviewRoute = require("./routes/user/userReviewRoute");
const profileRoute = require("./routes/user/profileRoute");
const cartRoute = require("./routes/user/cartRoute")
const orderRoute = require("./routes/user/orderRoute")
const adminOrderRoute = require("./routes/admin/adminOrderRoute")
const paymentRoute = require("./routes/user/paymentRoute");
const User = require("./model/userModel");
//Routes ends here

app.use(cors({
  origin : '*'
}))

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
app.use("/api/admin", adminUserRoute);
app.use("/api/admin", adminOrderRoute);
app.use("/api/reviews", userReviewRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoute);
//localhost:3000 /register  or
//localhost:3000 /login
//yt ma chai-> app.use("/api/v1/")

//telling nodeJs to give access to uploads folder only
app.use(express.static("./uploads"));

const PORT = process.env.PORT;
//listen server
const server = app.listen(PORT, () => {
  console.log(`Server has started at PORT ${PORT}`);
});

// const io = new Server(server)

// io.on("connection",(socket)=>{
//   // console.log("A user is connected")
//   // socket.on("disconnect",()=>{
//   //   console.log("A user is disconnected")
//   // })

//   socket.on('register',async(data)=>{
//     // const {email,username,phoneNumber,password} = data
//     // await User.create({
//     //   userName: username,
//     //   userEmail: email,
//     //   userPhoneNumber: phoneNumber,
//     //   userPassword: bcrypt.hashSync(password, 10),
//     // });
//     // socket.emit('response',{message: "User Registered"})   // broadcast jastai sabai lai pathauxa
//     io.to(socket.id).emit('response',{message: "User Registered"})   //jasle req garyo tyo socket id lai pathauxa
//   })
// })
// function getSocketIo(){
//   return io
// }
// module.exports.getSocketIo = getSocketIo
