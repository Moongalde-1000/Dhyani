import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { CurrentUser } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://server.keshavinfotechdemo2.com:4017';

interface LoginTypo {
  success: boolean;
  details?: any;
  message?: string;
}
interface AuthState {
  user: CurrentUser;
  sessionToken: string;
  refreshToken: string;
  business: boolean;
  remember?: boolean;
}
type CurrentAuthType = AuthState | undefined;
export interface AuthContextProps {
  currentAuth?: AuthState;
  loginUser: (credentials: {
    username: string;
    password: string;
    remember?: boolean;
  }) => Promise<LoginTypo>;
  logoutUser: () => void;
  setCurrentAuth: (auth: CurrentAuthType | ((prev: CurrentAuthType) => CurrentAuthType)) => void;
  generateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAuth, setCurrentAuth] = useState<CurrentAuthType>(() => {
    // Initialize state from localStorage
    const storedAuthState = sessionStorage.getItem("currentAuth") || localStorage.getItem("currentAuth");
    if (storedAuthState) return JSON.parse(storedAuthState);
    return undefined;
  });

  const loginUser = async (credentials: {
    username: string;
    password: string;
    remember?: boolean
  }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);

      const decoded = jwtDecode(res.data.refreshToken) as CurrentUser;
      decoded.dob = res.data?.userInfo?.dob ?? '';
      decoded.gender = res.data?.userInfo?.gender ?? '';
      decoded.phoneNumber = res.data?.userInfo?.phoneNumber ?? '';
      decoded.designation = res.data?.userInfo?.designation ?? '';
      decoded.lastLoginAt = res.data?.userInfo?.lastLoginAt ?? '';
      // Save Auth Info
      console.log('res.data?.userInfo?.lastLoginAt', decoded);


      setCurrentAuth({
        user: decoded,
        sessionToken: res.data.sessionToken,
        refreshToken: res.data.refreshToken,
        business: res.data.business,
        remember: credentials.remember
      });
      return res.data;
    } catch (err: any) {
      console.error(err);
      return err.response?.data;
    }
  };

  const generateSession = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/generate-session`,
        null,
        {
          headers: {
            "Refresh-Token": currentAuth?.refreshToken || "",
          },
        },
      );

      // Save Auth Info
      setCurrentAuth((prev) => {
        if (prev)
          return {
            ...prev,
            sessionToken: res.data.sessionToken,
            business: res.data.business,
          };
        else return prev;
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logoutUser = () => {
    // Perform logout logic
    setCurrentAuth(undefined);
  };

  useEffect(() => {
    // Sync state with localStorage
    if (currentAuth) {
      if (currentAuth.remember) {
        localStorage.setItem("currentAuth", JSON.stringify(currentAuth));
      }
      else {
        sessionStorage.setItem("currentAuth", JSON.stringify(currentAuth));
      }
    } else {
      localStorage.removeItem("currentAuth");
    }
  }, [currentAuth]);

  return (
    <AuthContext.Provider
      value={{
        currentAuth: currentAuth,
        loginUser,
        setCurrentAuth,
        logoutUser,
        generateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
