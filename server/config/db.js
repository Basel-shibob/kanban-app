const mongoose = require("mongoose");

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  if (!url) {
    throw new Error(
      "MongoDB connection URL is not defined in environment variables",
    );
  }
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

const getDBState = () =>{
  const readyState = mongoose.connection.readyState;
  return readyState;
};

module.exports = { connectDB, disconnectDB, getDBState };
