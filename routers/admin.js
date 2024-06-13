const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//route
//buat akun
router.post("/user", adminController.register);
//single akun
router.get("/user/:id", adminController.singleUser);
//edit akun
router.patch("/:id/edit", adminController.editUser);

module.exports = router;
