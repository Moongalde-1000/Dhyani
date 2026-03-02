import { AxiosInstance } from "axios";
import queryString from "query-string";


export const getUsersAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/admin?${stringified}`);
};

// Add new user
export const addUserAPI = async (api: AxiosInstance, data: {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  country?: string;
}) => {
  // Note: Backend registration endpoint
  return api.post('/auth/register', data);
};

// Edit user
export const editUserAPI = async (api: AxiosInstance, id: string, data: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'DEFAULT' | 'ADMIN';
  address?: string;
}) => {
  return api.post(`/user/admin/${id}`, data);
};

// Delete user
export const deleteUserAPI = async (api: AxiosInstance, id: string) => {
  return api.delete(`/admin/delete/${id}`);
};

export const getUserByIdAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/admin/${data.id}?${stringified}`);
};

// Alias for getUserByIdAPI to match the import in useAPI.tsx
export const getUserById = getUserByIdAPI;

export const updateUserProfileAPI = async (api: AxiosInstance, data: any) => {
  return api.put(`/user`, data);
};
export const updateChangePasswordAPI = async (api: AxiosInstance, data: any) => {
  return api.post(`/user/change-password`, data);
};

export const suspendUserAPI = async (api: AxiosInstance, id: string, suspend: boolean) => {
  return api.post(`/admin/${id}/suspend`, { suspend });
};

export const adminResetUserPasswordAPI = async (api: AxiosInstance, id: string, newPassword: string) => {
  return api.post(`/user/admin/${id}/reset-password`, { newPassword });
};
