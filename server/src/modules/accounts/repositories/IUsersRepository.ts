import { User } from "../entities/User";

export interface IUsersRepository {
  create(data: User): Promise<User>;
  findByName(name: string): Promise<User | null>;
  findById(Id: string): Promise<User | null>;
}
