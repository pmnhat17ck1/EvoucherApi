export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
}
