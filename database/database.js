const mongoose = require("mongoose");

exports.connectDatabase = async () => {
  //connecting to database
  // jaba samma database sanga connect hudaina wait gar vaneko
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected successfully");
};
