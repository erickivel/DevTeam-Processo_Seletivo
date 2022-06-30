import { inject, injectable } from "tsyringe";
import { User } from "../../src/modules/accounts/entities/User";
import { IUsersRepository } from "../../src/modules/accounts/repositories/IUsersRepository";


@injectable()
export class UsersActions {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) { }

  async create(data: User): Promise<User> {
    const user = await this.usersRepository.create(data);

    return user;
  };
};