import { User } from "../../../src/modules/accounts/entities/User";
import { IUsersRepository } from "../../../src/modules/accounts/repositories/IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create(data: User): Promise<User> {
    this.users.push(data);

    const userCreated = data;

    return userCreated;
  }

  async findByName(name: string): Promise<User | null> {
    const user = this.users.find(user => user.name === name);

    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);

    return user || null;
  }
}