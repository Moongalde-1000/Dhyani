// authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../types";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";
//const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  //const refreshToken = req.header("Refresh-Token");

  try {
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    /*if (!refreshToken) {
      return res.status(403).json({ error: "Unauthorized: No token provided" });
    }*/

    // Access Token Verify
    let decodedAccessToken: JwtPayload | null = null;
    try {
      decodedAccessToken = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.error(error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Unauthorized: Token expired" });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      // For other unexpected errors
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!decodedAccessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid accessToken token" });
    }

    /*// Refresh Token Verify
    let decodedRefreshToken: JwtPayload | null = null;
    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      ) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ error: "Forbidden: Token expired" });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
      }
      // For other unexpected errors
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!decodedRefreshToken) {
      return res
        .status(403)
        .json({ error: "Forbidden: Invalid refresh token" });
    }*/

    // Check if the refresh token is associated with a valid user
    const user = await prisma.users.findUnique({
      where: {
        id: decodedAccessToken.userId,
        // devices: {
        //   some: {
        //     refreshToken: refreshToken,
        //   },
        // },
      },
    });

    if (!user) {
      return res
        .status(403)
        .json({ error: "Forbidden: User not found" });
    }

    req.user = decodedAccessToken;
    next();
  } catch (error) {
    console.error(error);
    /*if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }*/
    // For other unexpected errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
