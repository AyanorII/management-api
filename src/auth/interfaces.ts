export interface AccessToken {
  access_token: string;
}

export interface JwtPayload {
  email: string;
  sub: number;
}
