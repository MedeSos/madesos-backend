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
    console.log(error);
    res.status(500).send("Terjadi kesalahan server");
  }
};

//edit akun
const editUser = async (req, res) => {};
module.exports = { register };
