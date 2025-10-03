export interface LoginAccountType {
  username?: string;
  password?: string;
}
export interface LoginResponseData {
  token_type: string;
  message: string;
  role: string; 
  expires_in: number;
  name: string;
  access_token: string;
  id: string;
}

export interface RefreshTokenResponseData {
  expires_in: number;
  access_token: string;
  token_type: string;
}
