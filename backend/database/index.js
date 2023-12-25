const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../config/index");

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_CONNECTION_STRING);

        console.log("MongoDB connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
