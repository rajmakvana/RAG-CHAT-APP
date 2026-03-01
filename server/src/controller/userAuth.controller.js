import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {  getAvatar } from "../utils/getAvtar.js";
import prisma from "../config/dataBase.js";
import { comparePassword, hashPassword } from "../utils/hashedPassword.js";


export const register = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password , username} = req.body;

  try {

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const avatarUrl = await getAvatar();

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatarUrl: avatarUrl.url
      }
    });

    const token = jwt.sign({ id: user.id , role : user.role }, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({ message: "User registered successfully", user: { email, role: user.role }, token });
    
  } catch (error) {
    res.status(500).json({ success : false , message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password , user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id , role : user.role }, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRE });

    res.json({ success : true , message : "Succesfully login user" , token , user : {email : user.email , role : user.role} });
    
  } catch (error) {
    res.status(500).json({success : false , message: "Server error", error: error.message });
  }
};

export const adminProtectedRoute = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" , user :  req.user });
}

export const userProtectedRoute = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" , user :  req.user });
}

