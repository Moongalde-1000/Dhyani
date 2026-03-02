import { AxiosInstance } from "axios";
import queryString from "query-string";

// {
//   "id": "66913a3854c5abc0fae00d03",
//   "type": "Technology",
//   "logo": "",
//   "description": "",
//   "userId": "66912d32008763e738443c41",
//   "createdAt": "2024-07-12T14:14:16.362Z",
//   "updatedAt": "2024-07-17T11:54:12.663Z"
// }
export const getDashboardAPI = async (api: AxiosInstance, data?: any) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });

  return api.get(`/dashboard?${stringified}`);
};
