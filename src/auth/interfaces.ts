export interface JwtPayload {
  email: string;
  sub: number;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
