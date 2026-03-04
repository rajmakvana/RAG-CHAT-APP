import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getAvatar } from "../utils/getAvtar.js";
import prisma from "../config/dataBase.js";
import { comparePassword, hashPassword } from "../utils/hashedPassword.js";


export const register = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password, username, organizationId } = req.body;

  try {

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });
    const avatarUrl = getAvatar();

    const hashedPassword = await hashPassword(password);

    // #1 — Accept optional organizationId; verify it exists if provided
    const userData = {
      email,
      password: hashedPassword,
      username,
      avatarUrl: avatarUrl.url,
    };

    if (organizationId) {
      const org = await prisma.organization.findUnique({ where: { id: organizationId } });
      if (!org) return res.status(400).json({ success: false, message: "Organization not found" });
      userData.organizationId = organizationId;
    }

    const user = await prisma.user.create({ data: userData });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({ success: true, message: "User registered successfully", user: { email, role: user.role }, token });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({ success: true, message: "Successfully logged in", token, user: { email: user.email, role: user.role } });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
