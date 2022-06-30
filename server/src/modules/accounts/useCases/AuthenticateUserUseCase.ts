import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

import { Either, left, right } from "../../../shared/logic/Either";
import { IncorrectCredentialsError } from "../errors/IncorrectCredentialsError";
import { IUsersRepository } from "../repositories/IUsersRepository";

interface IRequest {
  name: string;
  password: string;
};

interface IResponse {
  user: {
    name: string;
  },
  token: string;
};

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ name, password }: IRequest): Promise<Either<IncorrectCredentialsError, IResponse>> {
    const user = await this.usersRepository.findByName(name);

    if (!user) {
      return left(new IncorrectCredentialsError());
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return left(new IncorrectCredentialsError());
    };

    const token = sign({}, process.env.SECRET_TOKEN || "secretToken", {
      subject: user.id,
      expiresIn: process.env.TOKEN_EXPIRATION
    })

    const response = {
      user: {
        name: user.name,
      },
      token,
    };

    return right(response);
  }
}