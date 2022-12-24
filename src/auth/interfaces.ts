export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  refreshToken?: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
