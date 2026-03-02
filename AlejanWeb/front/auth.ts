// import NextAuth from 'next-auth';
import { AuthOptions, getServerSession } from "next-auth"

import Credentials from 'next-auth/providers/credentials';
// import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Role } from '@/@core/enums';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types";

const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  providers: [Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
      remember: { label: "Remember Me", type: "checkbox" },
      role: { label: "Role", type: "text" }
    },
    async authorize(credentials) {
      console.log('credentials', credentials);
      const parsedCredentials = z
        .object({
          email: z.string(),
          password: z.string().min(6),
          role: z.nativeEnum(Role),
          remember: z.boolean().optional(),
          redirect: z.string().optional(),
          callbackUrl: z.string().optional(),
          csrfToken: z.string().optional(),
          json: z.string().optional(),
        })
        .strict()
        .safeParse(credentials);
      if (parsedCredentials.success) {

        const { email, password, remember } = parsedCredentials.data;

        try {

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://server.keshavinfotechdemo2.com:4017';
          console.log('API_BASE_URL', API_BASE_URL);
          const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password, remember });
          console.log('res.data?.userInfo?.lastLoginAt', res.data);

          const refreshToken = res.data?.refreshToken;
          if (typeof refreshToken !== 'string') {
            throw new Error('Invalid refreshToken in response');
          }

          const decoded = jwtDecode(refreshToken) as CurrentUser;
          decoded.dob = res.data?.data?.dateOfBirth ?? '';
          decoded.gender = res.data?.data?.gender ?? '';
          decoded.phoneNumber = res.data?.data?.phone ?? '';
          decoded._id = decoded.userId;
          decoded.name = (decoded as any).fullName ?? decoded.name;
          decoded.sessionToken = res.data?.sessionToken ?? null;
          decoded.refreshToken = refreshToken;

          console.log('decoded', decoded);
          return decoded;

        } catch (error: any) {
          console.error('Login error:', error);
          return null;
        }
      }
      else {
        console.log('Invalid credentials', parsedCredentials.error.format());
      }
      return null;
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      console.log('token', token);
      console.log('user', user);

      if (user) {
        token.id = user._id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        // token.profilePicture = user.profilePicture;
        token.gender = user.gender;
        token.phoneNumber = user.phoneNumber;
        token.dob = user.dob;
        token.refreshToken = user.refreshToken;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    session({ session, token }) {

      console.log('token', token);
      console.log('session', session);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.refreshToken = token.refreshToken as string;
        session.user.sessionToken = token.sessionToken as string;
      }

      return session;
    },
  }

}

declare module "next-auth" {
  interface User {
    _id: string;
    id: string;
    role: Role;
    firstName: string;
    lastName: string;
    gender: string;
    profilePicture: string;
    phoneNumber: string;
    dob: string;
    sessionToken: string | null;
    refreshToken: string | null;
  }
  interface Session {
    user: User;
  }
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }