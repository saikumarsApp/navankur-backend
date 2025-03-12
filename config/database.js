const mongoose = require("mongoose");
const connectDB = async() => {
    await mongoose.connect("mongodb+srv://saikumar:6e46OgIBBop9qTQh@cluster0.lcctcsf.mongodb.net/")
}

module.exports = connectDB;