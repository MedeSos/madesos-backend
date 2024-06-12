const userModel = require("../models/user");
const bcrypt = require("bcrypt");

//Register akun
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await userModel.create({
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "user created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "user already in use" });
      }
      res.status(500).json({ message: "internal Server Eror" });
    }
  } catch (error) {
    res.status(500).send("Terjadi kesalahan server");
    return;
  }
};
//single akun
const singleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//edit akun
const editUser = async (req, res) => {
  const {
    name,
    email,
    password,
    title,
    description,
    profileImage,
    backgroundImage,
  } = req.body;
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        email,
        password,
        title,
        description,
        profileImage,
        backgroundImage,
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { register, singleUser, editUser };
