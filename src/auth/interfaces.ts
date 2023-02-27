export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  company: string;
  iat: number;
  exp: number;
  refreshToken?: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
