import express from "express";
import { addClient, editClient, getClientById, getAllClients, suspendClient } from "../controllers/client.controller";
import { authenticate } from "../middlewares/authenticate";

export const clientRouter = express.Router();

// Route to get all clients (public — no auth required)
clientRouter.get("/list", getAllClients);

// Route to add a new client (public)
clientRouter.post("/add", addClient);

// Route to edit an existing client (requires auth token)
clientRouter.put("/edit/:id", authenticate, editClient);

// Route to get client by ID (requires auth token)
clientRouter.get("/:id", getClientById);

// Route to suspend/unsuspend client (requires auth token)
clientRouter.post("/:id/suspend", suspendClient);
