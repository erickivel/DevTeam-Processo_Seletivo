import { injectable, inject } from "tsyringe";
import { hash } from "bcrypt";

import { Either, left, right } from "../../../shared/logic/Either";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUserResponse } from "../dtos/IUserResponse";
import { User } from "../entities/User";
import { IUsersRepository } from "../repositories/IUsersRepository";
import { PasswordDoesntMatchError } from "../errors/PasswordDoesntMatchError";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }
  async execute({
    name,
    password,
    passwordConfirmation,
  }: ICreateUserDTO): Promise<
    Either<
      PasswordDoesntMatchError |
      UserAlreadyExistsError,
      IUserResponse>
  > {
    const userExists = await this.usersRepository.findByName(name);

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    if (password !== passwordConfirmation) {
      return left(new PasswordDoesntMatchError());
    }

    const passwordHash = await hash(password, 8);

    const user = new User({
      name,
      password: passwordHash,
    });

    const userCreated = await this.usersRepository.create(user);

    const userMapped = {
      id: userCreated.id,
      name: userCreated.name,
    }

    return right(userMapped);
  }
}
