/*export type BusinessRole = "OWNER";*/
export type UserRole = "DEFAULT" | "ADMIN";

export interface CurrentUser {
  userId: string;
  _id: string;
  name: string;
  firstName: String;
  middleName: String;
  lastName: String;
  role: UserRole;
  email: string;
  phoneNumber?: string;
  dob?: string;
  username: string;
  imageUrl: string;
  gender?: Gender;
  country: Country;
  devices?:Devices[]
  sessionToken?: string;
  refreshToken?: string;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NOT_SPECIFY = "NOT_SPECIFY",
}

export enum Country {
  USA = "USA",
  IND = "IND",
}

export enum AdvertisementType {
  AdvertisementWithEndDate = "AdvertisementWithEndDate",
  AdvertisementWithTimeControl = "AdvertisementWithTimeControl",
  AdvertisementWithBudgetControl = "AdvertisementWithBudgetControl",
  CustomAdvertisement = "CustomAdvertisement",
}
export interface Devices {
  lastLogin:string;
}

export interface CompanyType {
  id:string;
  type:string;
  logo:string;
  description:string;
  userId:string;
}
  
 
export interface Users {
  _id: string;
  username: string;
  email: string;
  password: string;
  phoneNumber:string;
  createdAt: string;
  updatedAt: string;
} 