import express from "express";
import { login, register } from "../controller/userAuth.controller.js";
import { loginValidation, registerValidation } from "../utils/express-validation.js";

const router = express.Router();

// Register
router.post("/register", registerValidation, register);

// Login
router.post("/login", loginValidation, login);

export default router;