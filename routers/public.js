import { login, register } from "./../controllers/userController.js";
import emailLowercase from "../middlewares/helperMiddleware.js";
import express from "express";

const router = express.Router();

// middleware
router.use(emailLowercase);

// Auth Route
router.post("/login", login);

router.post("/register", register);

export default router;
