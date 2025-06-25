export interface JwtPayloadData {
  iss: string;
  iat: number;
  exp: number;
}

export class JwtPayload implements JwtPayloadData {
  readonly iss: string;
  readonly iat: number;
  readonly exp: number;

  constructor(data: JwtPayloadData) {
    this.iss = data.iss;
    this.iat = data.iat;
    this.exp = data.exp;
  }
}

export interface SwaggerJwtPayloadData extends JwtPayloadData {
  sub: string;
}

export class SwaggerJwtValidated extends JwtPayload {
  readonly sub: string;

  constructor(data: SwaggerJwtPayloadData) {
    super(data);
    this.sub = data.sub;
  }
}
