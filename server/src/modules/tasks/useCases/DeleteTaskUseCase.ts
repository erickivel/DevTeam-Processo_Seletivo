import { injectable, inject } from "tsyringe";

import { Either, left, right } from "../../../shared/logic/Either";

import { IUsersRepository } from "../../accounts/repositories/IUsersRepository";
import { ITasksRepository } from "../repositories/ITasksRepository";
import { ISubjectsRepository } from "../repositories/ISubjectsRepository";
import { UserDoesNotExistError } from "../errors/UserDoesNotExistError";
import { TaskDoesNotExistError } from "../errors/TaskDoesNotExistError";

interface IRequest {
  userId: string;
  taskId: string;
}

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("TasksRepository")
    private tasksRepository: ITasksRepository,
    @inject("SubjectsRepository")
    private subjectsRepository: ISubjectsRepository,
  ) { }
  async execute({
    userId,
    taskId,
  }: IRequest): Promise<
    Either<
      UserDoesNotExistError |
      TaskDoesNotExistError,
      null
    >> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserDoesNotExistError())
    }

    const taskExists = await this.tasksRepository.findById(taskId);

    if (!taskExists) {
      return left(new TaskDoesNotExistError(taskId))
    }

    const subject = await this.subjectsRepository.findById(taskExists.subjectId);

    await this.tasksRepository.deleteOne(taskId);

    if (subject && subject.tasks?.length === 1 && subject.tasks[0].id === taskId) {
      await this.subjectsRepository.deleteOne(subject.id);
    }

    return right(null);
  }
}
