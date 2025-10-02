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

export interface RefreshTokenResponseData {
  access_token: string;
  expires_in: number;
}

// Kiểu trả về giống axios
export type RefreshTokenResponseDataType = AxiosResponse<RefreshTokenResponseData>
export type LoginResponseType = AxiosResponse<LoginResponseData>