import { UserRole } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  fullName: string;
  displayName: string;
  role: UserRole;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
}

export interface UserResponse {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
