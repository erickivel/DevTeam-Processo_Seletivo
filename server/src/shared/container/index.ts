import { container } from "tsyringe";

import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";
import { PrismaUsersRepository } from "../../modules/accounts/infra/database/PrismaUsersRepository";
import { ITasksRepository } from "../../modules/tasks/repositories/ITasksRepository";
import { PrismaTasksRepository } from "../../modules/tasks/infra/database/PrismaTasksRepository";
import { ISubjectsRepository } from "../../modules/tasks/repositories/ISubjectsRepository";
import { PrismaSubjectsRepository } from "../../modules/tasks/infra/database/PrismaSubjectsRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

container.registerSingleton<ITasksRepository>(
  "TasksRepository",
  PrismaTasksRepository
);

container.registerSingleton<ISubjectsRepository>(
  "SubjectsRepository",
  PrismaSubjectsRepository
);