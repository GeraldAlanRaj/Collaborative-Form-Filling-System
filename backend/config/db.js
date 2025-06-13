const mongoose = require("mongoose");
require("dotenv").config();

const MongoDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });

    console.log("MongoDB connected")
  }catch(error)
  {
    console.error("MongoDB Connection Error:", error);
  }
}

module.exports = MongoDB;
