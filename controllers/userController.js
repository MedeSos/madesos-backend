import userModel from "../models/user.js";
import bcrypt from 'bcrypt';

//User Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check empty password
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Please provide password" });
    }
    // check if user exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: "Registered successfully" });

  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

//User Login

//Single User
export const singleUser = async (req, res) => {
  try {
    // check if user exists
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

//Edit User
export const editUser = async (req, res) => {
  const {
    name,
    password,
    title,
    description,
    profileImage,
    backgroundImage,
  } = req.body;

  try {
    let user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update if user change new value
    const updateUser = {
      name: name || user.name,
      password: password || user.password,
      title: title || user.title,
      description: description ||  user.description,
      profileImage: profileImage || user.profileImage,
      backgroundImage: backgroundImage || user.backgroundImage,
    };
    // Update User
    await userModel.updateOne({ _id: req.params.id }, updateUser);
    // Find Updated User
    user = await userModel.findOne({ _id: req.params.id });

    res.status(200).json({message: "User has been updated", user});
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
