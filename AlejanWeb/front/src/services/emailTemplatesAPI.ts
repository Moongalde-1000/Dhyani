import { AxiosInstance } from "axios";
import queryString from "query-string";


export const getEmailTemplatesAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });
  return api.get(`/email-tamplates?${stringified}`);
};

export const updateEmailTemplatesAPI = async (api: AxiosInstance, data?: any) => {
  return api.patch(`/email-tamplates`,data);
};
