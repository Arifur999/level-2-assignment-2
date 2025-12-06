export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  password: string;
}
