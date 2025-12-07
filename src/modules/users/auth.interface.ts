export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: "admin" | "customer";
}
