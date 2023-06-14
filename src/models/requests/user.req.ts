export class RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export class LoginRequest {
  username: string;
  password: string;
}
