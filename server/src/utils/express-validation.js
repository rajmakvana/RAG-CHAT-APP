import { body } from "express-validator";

// Register Validation
export const registerValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Login Validation
export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// #7 — Upload file validation with MIME type check
const ALLOWED_MIME_TYPES = ["application/pdf"];

export const uploadFileValidation = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File is required" });
  }
  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: `Invalid file type: ${req.file.mimetype}. Only PDF files are allowed.`,
    });
  }
  next();
};

// Organization registration validation
export const orgRegisterValidation = [
  body("orgName").notEmpty().withMessage("Organization name is required"),
  body("adminEmail").isEmail().withMessage("Valid admin email required"),
  body("adminPassword")
    .isLength({ min: 6 })
    .withMessage("Admin password must be at least 6 characters"),
  body("adminName").notEmpty().withMessage("Admin name is required"),
];

// Accept invite validation
export const acceptInviteValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
