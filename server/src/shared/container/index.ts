import { container } from "tsyringe";

import { PrismaUsersRepository } from "../../modules/accounts/infra/database/PrismaUsersRepository";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);