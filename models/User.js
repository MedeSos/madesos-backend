const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  title: String,
  description: String,
  profileImage: String,
  backgroundImage: String,
});

module.exports = mongoose.model("User", userSchema);
