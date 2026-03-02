import { AxiosInstance } from "axios";

export const userGeneralRegisterAPI = async (api: AxiosInstance, data: any) => {
  return api.post("/auth/register", data);
};
export type sendVerifyEmailAPIPayload = {
  email: string;
  type: "NEW" | "CHANGE"; // NEW, CHANGE
  userId: string;
};
export const sendVerifyEmailAPI = async (
  api: AxiosInstance,
  data: sendVerifyEmailAPIPayload,
) => {
  return api.post("/auth/verify-email", data);
};
export type verifyAPIPayload = {
  otp: number;
  id: string;
  update?: boolean;
};
export const verifyEmailAPI = async (
  api: AxiosInstance,
  data: verifyAPIPayload,
) => {
  return api.put("/auth/verify-email", data);
};
export type sendVerifyPhoneAPIPayload = {
  phoneNumber: number | string;
  type: "NEW" | "CHANGE"; // NEW, CHANGE
  userId: string;
};
export const sendVerifyPhoneAPI = async (
  api: AxiosInstance,
  data: sendVerifyPhoneAPIPayload,
) => {
  return api.post("/auth/verify-phone", data);
};
export const verifyPhoneAPI = async (
  api: AxiosInstance,
  data: verifyAPIPayload,
) => {
  return api.put("/auth/verify-phone", data);
};

export const userBusinessRegisterAPI = async (
  api: AxiosInstance,
  data: any,
) => {
  return api.post("/auth/register-business", data);
};

export const checkUsernameAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/check-username`, data);
};
export const checkPhoneNumberAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/check-phone-number`, data);
};
export const checkEmailAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/check-email`, data);
};
export const forgotUsernameAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/forgot-username`, data);
};
export const forgotPasswordAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/forgot-password`, data);
};
export const resetPasswordAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/reset-password`, data);
};
export const verifyResetPasswordTokenAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/auth/reset-password/token-verify`, data);
};