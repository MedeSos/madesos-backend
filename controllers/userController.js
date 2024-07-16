import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema, updateSchema } from "../validations/userValidation.js";
import { unlink, access } from 'fs';
import mongoose from "mongoose";

//User Register
export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error:"VALIDATION_ERROR",
      statusCode: 400,
      message: error.details[0].message.replace(/"/g, '') 
    });
  }

  try {
    const { email, password } = req.body;
    // check empty email
    if (!email || email.trim() === "") {
      return res.status(400).json({ 
        error:"VALIDATION_ERROR",
        statusCode: 400,
        message: "Please provide email" 
      });
    }
    // check empty password
    if (!password || password.trim() === "") {
      return res.status(400).json({
         error:"VALIDATION_ERROR",
         statusCode: 400,
         message: "Please provide password" 
        });
    }
    // check if user exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        error:"USER_ALREADY_EXISTS",
         statusCode: 409,
         message: "User already in use" 
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
       error:null,
       statusCode: 201,
       message: "Registered successfully" 
      });
  } catch (error) {
    return res.status(500).json({
      error:"INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message:"Internal Server Error"
    });
  }
};

//User Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
       error:"VALIDATION_ERROR",
       statusCode: 400,
       message: error.details[0].message.replace(/"/g, '') 
      });
  }

  // check empty email
  if (!email || email.trim() === "") {
    return res.status(400).json({
       error:"VALIDATION_ERROR",
       statusCode: 400,
       message: "Please provide email" 
      });
  }
  // check empty password
  if (!password || password.trim() === "") {
    return res.status(400).json({
       error:"VALIDATION_ERROR",
       statusCode: 400,
       message: "Please provide password" 
      });
  }

  // check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      error:"UNAUTHORIZED",
       statusCode: 401,
       message: "invalid email or password" 
      });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      error:"UNAUTHORIZED",
       statusCode: 401,
       message: "invalid email or password" 
      });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
  res.status(200).json({
     error:null,
     statusCode: 200,
     data:{token} 
    });
};

//Single User
export const singleUser = async (req, res) => {
  try {
    // check if user exists
    const user = await userModel.findById(req.params.id, "-password -__v");
    if (!user) {
      return res.status(400).json({
         error:"VALIDATION_ERROR",
         statusCode: 400,
         message: "User not found" 
        });
    }
    res.status(200).json({
       error:null,
       statusCode: 200,
       message: "User found successfully",
       data:user
    });
  } catch (error) {
    res.status(500).json({
       error:"INTERNAL_SERVER_ERROR",
       statusCode: 500,
       message:"Internal Server Error"
    });
  }
};

//Edit User
export const editUser = async (req, res) => {
  const { name, title, description } =
    req.body;

  // check valid id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        unlink(req.files[key][0].path, (err) => {
          if (err) throw new Error("Failed to delete file!");
        })
      });
    }
    return res.status(400).json({
       error:"VALIDATION_ERROR",
       statusCode: 400,
       message: "Invalid ID" 
      });
  }

  // check if user is not authorized
  if (req.user.id !== req.params.id) {
    return res.status(401).json({
       error:"VALIDATION_ERROR",
       statusCode: 401,
       message: "Unauthorized" 
      });
  }

  try {
    let user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
         error:"VALIDATION_ERROR",
         statusCode: 404,
         message: "User not found" 
        });
    }

    // Update if user change new value
    const updateUser = {
      name: name || user.name,
      title: title || user.title,
      description: description || user.description,
    };

    if (req.files) {
      // if user change profile image
      if (req.files["profile-image"]) {
        const file = req.files["profile-image"][0];
        const oldImage = user.profileImage;
        if (oldImage) {
          const imageName = user.profileImage.split("/").pop();
          access(`${file.destination}/${imageName}`, (err) => {
            if (err) throw new Error("File not found!");
            unlink(`${file.destination}/${imageName}`, (err) => {
              if (err) throw new Error("Failed to delete file!");
            });
          })
        }
        const profileImage = req.protocol + "://" + req.get("host") + "/assets/images/" + file.filename;
        updateUser.profileImage = profileImage;
      }

      // if user change background image
      if (req.files["background-image"]) {
        const file = req.files["background-image"][0];
        const oldImage = user.backgroundImage;
        if (oldImage) {
          const imageName = user.backgroundImage.split("/").pop();
          access(`${file.destination}/${imageName}`, (err) => {
            if (err) throw new Error("File not found!");
            unlink(`${file.destination}/${imageName}`, (err) => {
              if (err) throw new Error("Failed to delete file!");
            });
          })
        }
        const backgroundImage = req.protocol + "://" + req.get("host") + "/assets/images/" + file.filename;
        updateUser.backgroundImage = backgroundImage;
      }
    }

    // Update if user change new value
    if (req.body.password && req.body.password.length > 0) {
      updateUser.password = req.body.password;
    }

    const { error } = updateSchema.validate(updateUser);
    if (error) {
      return res.status(400).json({ message: error.details[0].message.replace(/"/g, '') });
    }

    // Hash Password
    if (updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }
    // Update User
    await userModel.updateOne({ _id: req.params.id }, updateUser);
    // Find Updated User
    user = await userModel.findOne({ _id: req.params.id }, "-password -__v");

    res.status(200).json({
       error:null,
       statusCode: 200,
       message: "User has been updated",
       data: user 
      });
  } catch (error) {
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        unlink(req.files[key][0].path, (err) => {
          if (err) throw new Error("Failed to delete file!");
        })
      });
    }
    res.status(500).json({
       error:"INTERNAL_SERVER_ERROR",
       statusCode: 500,
       message:"Internal Server Error"
    });
  }
};
