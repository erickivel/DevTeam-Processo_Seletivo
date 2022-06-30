import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";



interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json("Token missing");
    return;
  }

  const [, token] = authHeader.split(" ");

  try {

    const { sub: userId } = verify(
      token,
      process.env.SECRET_TOKEN || "secretToken",
    ) as IPayload;

    request.user = {
      id: userId,
    }

    next();
  } catch (error) {
    response.status(401).json("Invalid token");
  }
};