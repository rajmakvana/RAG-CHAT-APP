import { uploadFile, deleteDataset } from "../controller/file.controller.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";
import { uploadFileValidation } from "../utils/express-validation.js";
import multer from "multer";

// #7 — Add file size limit (10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// #17 — Health check now requires auth
router.get("/", authMiddleware, (req, res) => {
  res.json({ success: true, message: "working" });
});

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.single("file"),
  uploadFileValidation,
  uploadFile
);

// #5 — Delete dataset endpoint
router.delete(
  "/dataset/:datasetId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteDataset
);

export default router;