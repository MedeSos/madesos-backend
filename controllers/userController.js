import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema, updateSchema } from "../validations/userValidation.js";

//User Register
export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
  }

  try {
    const { email, password } = req.body;
    // check empty email
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Please provide email" });
    }
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
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

//User Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
  }

  // check empty email
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Please provide email" });
  }
  // check empty password
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Please provide password" });
  }

  // check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
  res.status(200).json({ token });
};

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
  const { name, title, description, profileImage, backgroundImage } =
    req.body;

  // check if user is not authorized
  if (req.user.id !== req.params.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update if user change new value
    const updateUser = {
      name: name || user.name,
      title: title || user.title,
      description: description || user.description,
      profileImage: profileImage || user.profileImage,
      backgroundImage: backgroundImage || user.backgroundImage,
    };

    // Update if user change new value
    if (req.body.password.length > 0) {
      updateUser.password = req.body.password;
    }

    const { error } = updateSchema.validate(updateUser);
    if (error) {
      return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
    }

    console.log(updateUser.password);
    // Hash Password
    if (updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }
    // Update User
    await userModel.updateOne({ _id: req.params.id }, updateUser);
    // Find Updated User
    user = await userModel.findOne({ _id: req.params.id });

    res.status(200).json({ message: "User has been updated", user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
