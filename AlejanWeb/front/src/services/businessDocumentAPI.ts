import { AxiosInstance } from "axios";
import queryString from "query-string";

// {
//   "id": "669928d51cc7614f35b61c58",
//   "name": "Technology",
//   "fileType": [
//       ".pdf"
//   ],
//   "country": "IND",
//   "state": [
//       "ALL"
//   ],
//   "status": true,
//   "userId": "66912d32008763e738443c41",
//   "description": "",
//   "createdAt": "2024-07-18T14:38:11.864Z",
//   "updatedAt": "2024-07-18T14:39:00.062Z"
// }
export const getBusinessDocumentAPI = async (
  api: AxiosInstance,
  data?: any,
) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });

  return api.get(`/business-document-list?${stringified}`);
};
export const getBusinessDocumentUserAPI = async (
  api: AxiosInstance,
  data?: any,
) => {
  const stringified = queryString.stringify(data, {
    skipNull: true,
    skipEmptyString: true,
  });

  return api.get(`/business-document-list/user?${stringified}`);
};
