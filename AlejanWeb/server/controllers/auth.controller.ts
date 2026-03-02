// auth.controller.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../db";
import { JwtPayload } from "../types";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { addMinutes } from 'date-fns';
import { generateRandomPassword, hashPassword } from '../utils/password';
import { PrismaClient } from '@prisma/client';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const FRONT_URL = process.env.FRONT_URL || "";
const TOKEN_EXPIRY_MINUTES = 30;
const VERIFICATION_CODE_EXPIRY_MINUTES = 10;

const prisma = new PrismaClient();

// Helper function to generate a random 4-digit code
const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Images will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

export const login = async (req: Request, res: Response) => {
  try {
    //const { email, password ,fcmToken,deviceType,deviceVersion} = req.body;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: 0,
        message: "Email and password are required",
        data: {}
      });
    }

    const identifier = String(email).trim().toLowerCase();

    const user = await db.users.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        displayName: true,
        fullName: true,
        // exclude fields that may contain nulls in legacy data to avoid conversion errors
        phone: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: 0, message: "Invalid email/username or password", data: {} });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .send({ success: 0, message: "Invalid Password", data: {} });
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      displayName: user.displayName || "",
      email: user.email,
      fullName: user.fullName || "",
      role: user.role,
    };

    console.log('jwtPayload', jwtPayload);
    const refreshToken = jwt.sign(jwtPayload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    const sessionToken = jwt.sign(jwtPayload, JWT_SECRET, {
      expiresIn: "2h",
    });

    const verificationCode = generateVerificationCode();
    const verificationExpiry = addMinutes(new Date(), VERIFICATION_CODE_EXPIRY_MINUTES);

    const lastLoginAt = new Date()
    const data = {
      userId: user.id,
      fullName: user.fullName || "",
      displayName: user.displayName || "",
      email: user.email,
      phone: user.phone,
      lastLoginAt: lastLoginAt,

    };

    // Handle login response based on role
    if (user.role === "ADMIN") {
      res.status(200).json({
        success: 1,
        message: "Login successful",
        sessionToken,
        refreshToken,
        data,
      });
    } else if (user.role === "CLIENT") {
      // CLIENT logs in directly — update lastLoginAt and return tokens
      await db.users.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      });

      return res.status(200).json({
        success: 1,
        message: "Login successful",
        sessionToken,
        refreshToken,
        data,
      });
    } else {
      // DEFAULT users go through verification code flow
      await db.users.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      });

      return res.status(200).json({
        success: 1,
        message: 'Verification code sent to your email',
        data
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: 0 });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: 0,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await db.users.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // For security reasons, don't reveal if the email exists
      return res.status(200).json({
        success: 1,
        message: "If your email exists in our system, you will receive a password reset email",
      });
    }

    // Generate a new random password
    const newPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    await db.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        authToken: null, // Invalidate any existing sessions
      },
    });


    return res.status(200).json({
      success: 1,
      message: "Password reset email sent successfully. Please check your email for the new password.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: 0,
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: 0,
        message: "oldPassword, newPassword and confirmPassword are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: 0, message: "New password and confirm password do not match" });
    }

    const user = await db.users.findUnique({
      where: { id: req.user?.userId },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: 0, message: "Username not found", details: { path: "username" } });
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res
        .status(401)
        .send({ success: 0, message: "Invalid Old Password", details: { path: "oldPassword" } });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const findResult = await db.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword
      }
    });

    res.status(200).json({
      success: 1,
      message: "Password Updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ success: 0, message: 'User not found' });
    }

    // Delete user
    await prisma.users.delete({
      where: { id }
    });

    res.json({ success: 1, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: 0, message: "Unauthorized" });
    }

    await prisma.users.update({
      where: { id: userId },
      data: { authToken: null as any },
    });

    return res.status(200).json({ success: 1, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: 0, message: "Internal Server Error" });
  }
};

