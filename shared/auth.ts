export interface JwtUserPayload {
  sub: number | string;
  username?: string;
  v: number;
  iat?: number;
  exp?: number;
}