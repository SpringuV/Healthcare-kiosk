import type { AxiosResponse } from "axios";
export interface LoginAccountType {
  username?: string;
  password?: string;
  email?: string;
}
export interface LoginResponseData {
  token_type: string;
  message: string;
  _id: string;
  role: string;  
}

// Kiểu trả về giống axios
export type LoginResponseType = AxiosResponse<LoginResponseData>;