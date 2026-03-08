import prisma from "../config/dataBase.js";
import { hashPassword } from "../utils/hashedPassword.js";
import { getAvatar } from "../utils/getAvtar.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { sendInviteEmail } from "../config/mailer.js";

// Register a new organization + admin user in one step (public endpoint)
export const registerOrganization = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const {
    orgName,
    orgType,
    description,
    context,
    systemPrompt,
    website,
    adminEmail,
    adminPassword,
    adminName,
  } = req.body;

  try {
    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create org + admin in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: orgName.trim(),
          type: orgType || "OTHER",
          description: description || null,
          context: context || null,
          systemPrompt: systemPrompt || null,
          website: website || null,
        },
      });

      const hashedPwd = await hashPassword(adminPassword);
      const avatarUrl = getAvatar();

      const admin = await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPwd,
          username: adminName,
          avatarUrl: avatarUrl.url,
          role: "ADMIN",
          organizationId: organization.id,
        },
      });

      return { organization, admin };
    });

    const token = jwt.sign({ id: result.admin.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      message: "Organization registered successfully",
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        type: result.organization.type,
      },
      user: {
        id: result.admin.id,
        email: result.admin.email,
        username: result.admin.username,
        role: result.admin.role,
        organizationId: result.admin.organizationId,
      },
      token,
    });
  } catch (error) {
    console.error("Org registration error:", error);
    res.status(500).json({ success: false, message: "Failed to register organization" });
  }
};

// Update organization details (ADMIN only)
export const updateOrganization = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    if (!orgId) {
      return res.status(400).json({ success: false, message: "You do not belong to any organization" });
    }

    const { name, type, description, context, systemPrompt, website, logoUrl } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (context !== undefined) updateData.context = context;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;
    if (website !== undefined) updateData.website = website;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Update org error:", error);
    res.status(500).json({ success: false, message: "Failed to update organization" });
  }
};

// Generate invite link for a user and send email (ADMIN only)
export const inviteUser = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    if (!orgId) {
      return res.status(400).json({ success: false, message: "You must belong to an organization first" });
    }

    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Get org name for the email
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true },
    });

    // Check if there's already a pending invite for this email in this org
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        email,
        organizationId: orgId,
        accepted: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: "An active invite already exists for this email",
        inviteToken: existingInvite.token,
      });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role: role || "USER",
        organizationId: orgId,
        expiresAt,
      },
    });

    // Build the invite link (frontend will handle this route)
    const inviteLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/accept-invite/${token}`;

    // Send invite email via Nodemailer
    let emailSent = false;
    try {
      await sendInviteEmail(email, org?.name || "Our Organization", inviteLink, role || "USER");
      emailSent = true;
    } catch (emailErr) {
      console.error("Failed to send invite email (non-fatal):", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? `Invite sent to ${email}`
        : `Invite created for ${email} (email could not be sent — share the link manually)`,
      inviteLink,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      emailSent,
    });
  } catch (error) {
    console.error("Invite user error:", error);
    res.status(500).json({ success: false, message: "Failed to create invite" });
  }
};

// Accept invite — register with invite token (public endpoint)
export const acceptInvite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { token } = req.params;
  const { username, email, password } = req.body;

  try {
    // Find the invitation
    const invitation = await prisma.invitation.findUnique({ where: { token } });

    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invalid invite link" });
    }

    if (invitation.accepted) {
      return res.status(400).json({ success: false, message: "This invite has already been used" });
    }

    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({ success: false, message: "This invite has expired" });
    }

    if (invitation.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email does not match the invitation",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // If user exists but has no org, assign them
      if (!existingUser.organizationId) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: existingUser.id },
            data: {
              organizationId: invitation.organizationId,
              role: invitation.role,
            },
          }),
          prisma.invitation.update({
            where: { id: invitation.id },
            data: { accepted: true },
          }),
        ]);

        const loginToken = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return res.json({
          success: true,
          message: "Joined organization successfully",
          token: loginToken,
          user: { email: existingUser.email, role: invitation.role },
        });
      }

      return res.status(400).json({
        success: false,
        message: "User already belongs to another organization",
      });
    }

    // Create new user and mark invite as accepted
    const hashedPwd = await hashPassword(password);
    const avatarUrl = getAvatar();

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPwd,
          username,
          avatarUrl: avatarUrl.url,
          role: invitation.role,
          organizationId: invitation.organizationId,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { accepted: true },
      });

      return newUser;
    });

    const loginToken = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      message: "Account created and joined organization successfully",
      token: loginToken,
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        organizationId: result.organizationId,
      },
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    res.status(500).json({ success: false, message: "Failed to accept invite" });
  }
};

// Get current user's organization details
export const getOrganization = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    if (!orgId) {
      return res.status(404).json({ success: false, message: "You do not belong to any organization" });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            avatarUrl: true,
          },
        },
        datasets: {
          select: {
            id: true,
            filename: true,
            createdAt: true,
          }
        },
        _count: {
          select: { threads: true },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    res.json({ success: true, organization });
  } catch (error) {
    console.error("Get org error:", error);
    res.status(500).json({ success: false, message: "Failed to get organization" });
  }
};

// Remove a user from the organization (ADMIN only)
export const removeMember = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    const { userId } = req.params;

    if (!orgId) {
      return res.status(400).json({ success: false, message: "You do not belong to any organization" });
    }

    // Check if user to be removed exists and belongs to the same org
    const userToRemove = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToRemove || userToRemove.organizationId !== orgId) {
      return res.status(404).json({ success: false, message: "User not found in your organization" });
    }

    // Prevent removing oneself
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot remove yourself from the organization" });
    }

    // If removing an admin, check if there's at least one other admin
    if (userToRemove.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: {
          organizationId: orgId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: "Cannot remove the last administrator of the organization" });
      }
    }

    // Remove user from organization by setting organizationId to null and role to USER (or deleting them if that's preferred)
    // The user request says "delete the user"
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "User removed and deleted successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ success: false, message: "Failed to remove member" });
  }
};
