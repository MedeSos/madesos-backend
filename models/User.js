import mongoose from 'mongoose';

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

const userModel = mongoose.model("User", userSchema);
export default userModel;