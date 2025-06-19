export interface JwtPayload {
  iss: string;
  iat: number;
  exp: number;
}

export interface SwaggerJwtPayload {
  sub: string;
}

export interface AuthJwtPayload {
  userId: string;
  role: string;
}
