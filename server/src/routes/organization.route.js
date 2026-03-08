import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  registerOrganization,
  updateOrganization,
  inviteUser,
  acceptInvite,
  getOrganization,
  removeMember,
} from "../controller/organization.controller.js";
import { orgRegisterValidation, acceptInviteValidation } from "../utils/express-validation.js";

const router = Router();

// Public: Register new organization + admin (no auth needed)
router.post("/register", orgRegisterValidation, registerOrganization);

// Public: Accept invite and create account (no auth needed)
router.post("/accept-invite/:token", acceptInviteValidation, acceptInvite);

// Protected: Update organization details
router.put("/", authMiddleware, roleMiddleware(["ADMIN"]), updateOrganization);

// Protected: Generate invite link for a user
router.post("/invite", authMiddleware, roleMiddleware(["ADMIN"]), inviteUser);

// Protected: Get current org details
router.get("/", authMiddleware, roleMiddleware(["USER", "ADMIN"]), getOrganization);

// Protected: Remove a member from the organization
router.delete("/member/:userId", authMiddleware, roleMiddleware(["ADMIN"]), removeMember);

export default router;
