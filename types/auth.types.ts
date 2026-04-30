export interface User {
  id: string;
  email: string;
  role: string;
  branch_id: string | null;
}

/** Shape returned inside the backend's `data` envelope for login/register */
export interface LoginData {
  access: string;
  refresh: string;
  user: User;
}

export type AuthResponse = LoginData;

/** Claims inside the JWT access token (matches backend _make_access_token payload) */
export interface DecodedToken {
  user_id: string;
  email: string;
  branch_id: string | null;
  role: string;
  exp: number;
  iat: number;
}
