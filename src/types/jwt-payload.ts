export type JwtPayload = {
  id: string;
  jti: string;
  iat: number;
  exp: number;
};
