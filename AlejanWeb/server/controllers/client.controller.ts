import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Add a new client
 */
export const addClient = async (req: Request, res: Response) => {
    try {
        const { userName, email, phonenumber, password } = req.body;

        // Validation
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: 0,
                message: "UserName, email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already exists
        const existingUser = await prisma.users.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return res.status(409).json({
                success: 0,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create client
        const newClient = await prisma.users.create({
            data: {
                fullName: userName,
                displayName: userName,
                email: normalizedEmail,
                phone: phonenumber || null,
                password: hashedPassword,
                role: "CLIENT" as UserRole,
            },
        });

        // Generate authToken
        const authToken = jwt.sign(
            { userId: newClient.id, email: newClient.email, role: newClient.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Save authToken to the user
        const updatedClient = await prisma.users.update({
            where: { id: newClient.id },
            data: { authToken },
        });

        return res.status(201).json({
            success: 1,
            message: "Client added successfully",
            data: {
                id: updatedClient.id,
                userName: updatedClient.displayName,
                email: updatedClient.email,
                phonenumber: updatedClient.phone,
                role: updatedClient.role,
                authToken: updatedClient.authToken,
            },
        });
    } catch (error: any) {
        console.error("Add Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Edit an existing client
 */
export const editClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, email, phonenumber } = req.body;

        // Check if client exists
        const client = await prisma.users.findUnique({
            where: { id },
        });

        if (!client || client.role !== ("CLIENT" as UserRole)) {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }

        const updateData: any = {};
        if (userName) {
            updateData.fullName = userName;
            updateData.displayName = userName;
        }
        if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            // Check if email is already taken by another user
            const existingEmail = await prisma.users.findUnique({
                where: { email: normalizedEmail },
            });
            if (existingEmail && existingEmail.id !== id) {
                return res.status(409).json({
                    success: 0,
                    message: "Email already exists",
                });
            }
            updateData.email = normalizedEmail;
        }
        if (phonenumber) updateData.phone = phonenumber;


        const updatedClient = await prisma.users.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            success: 1,
            message: "Client updated successfully",
            data: {
                id: updatedClient.id,
                userName: updatedClient.displayName,
                email: updatedClient.email,
                phonenumber: updatedClient.phone,
                role: updatedClient.role,
            },
        });
    } catch (error: any) {
        console.error("Edit Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Get client by ID
 */
export const getClientById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const client = await prisma.users.findUnique({
            where: { id },
        });

        if (!client || client.role !== ("CLIENT" as UserRole)) {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }

        return res.status(200).json({
            success: 1,
            data: {
                id: client.id,
                userName: client.displayName,
                email: client.email,
                role: client.role,
                phonenumber: client.phone,
                profileImage: client.profileImage,
                is_suspended: client.is_suspended,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                lastLoginAt: client.lastLoginAt
            },
        });
    } catch (error: any) {
        console.error("Get Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Get all clients
 */
export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await prisma.users.findMany({
            where: {
                role: "CLIENT" as UserRole,
            },
            select: {
                id: true,
                fullName: true,
                displayName: true,
                email: true,
                phone: true,
                profileImage: true,
                role: true,
                is_suspended: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: 1,
            message: "Clients retrieved successfully",
            total: clients.length,
            data: clients,
        });
    } catch (error: any) {
        console.error("Get All Clients Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Suspend/Unsuspend a client
 */
export const suspendClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { suspend } = req.body;

        if (typeof suspend !== 'boolean') {
            return res.status(400).json({
                success: 0,
                message: "Property 'suspend' (boolean) is required in the request body",
            });
        }

        // Check if client exists
        const client = await prisma.users.findUnique({
            where: { id },
        });

        if (!client || client.role !== ("CLIENT" as UserRole)) {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }

        const updatedClient = await prisma.users.update({
            where: { id },
            data: { is_suspended: suspend },
        });

        return res.status(200).json({
            success: 1,
            message: suspend ? "Client suspended successfully" : "Client unsuspended successfully",
            data: {
                id: updatedClient.id,
                is_suspended: updatedClient.is_suspended,
            },
        });
    } catch (error: any) {
        console.error("Suspend Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
