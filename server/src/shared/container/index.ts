import { container } from "tsyringe";
import { UsersRepositoryInMemory } from "../../../tests/modules/accounts/Doubles/repositories/UsersRepositoryInMemory";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepositoryInMemory
);