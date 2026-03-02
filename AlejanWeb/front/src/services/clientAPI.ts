import { AxiosInstance } from "axios";
import queryString from "query-string";


export const getClientsAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/client/list?${stringified}`);
};


export const getClientByIdAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/client/${data.id}?${stringified}`);
};


export const suspendClientAPI = async (api: AxiosInstance, id: string, suspend: boolean) => {
  return api.post(`/client/${id}/suspend`, { suspend });
};

