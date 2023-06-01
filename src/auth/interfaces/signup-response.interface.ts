export interface SignupResponse {
  refreshToken: string;
  accessToken: string;
  message: string;
  user: {
    _id: string;
    email: string;
  };
}
