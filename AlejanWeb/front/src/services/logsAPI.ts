import { AxiosInstance } from "axios";
import queryString from "query-string";


export const getLogsUserAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/log/user?${stringified}`);
};

export const getLogsAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/log/business?${stringified}`);
};
