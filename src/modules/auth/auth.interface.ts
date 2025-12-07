export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

export interface SigninPayload {
  email: string;
  password: string;
}
