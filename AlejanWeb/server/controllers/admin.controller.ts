// admin.controller.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../db";
import { JwtPayload } from "../types";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await db.users.findMany({
      where: {
        role: 'DEFAULT',
      },
    });
    res.status(200).json({
      success: true,
      message: "Successfully retrieved users",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const adminSuspendUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { suspend } = req.body as { suspend: boolean };
    const user = await db.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const updated = await db.users.update({ where: { id }, data: { is_suspended: !!suspend } });
    res.status(200).json({ success: true, message: suspend ? "User suspended" : "User unsuspended", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.users.findUnique({
      where: { id },
      // Include any related data you want to fetch
      // Example: posts, comments, etc.
      // include: {
      //   posts: true,
      //   comments: true,
      // },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
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