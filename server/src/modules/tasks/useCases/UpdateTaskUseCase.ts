import { injectable, inject } from "tsyringe";

import { Either, left, right } from "../../../shared/logic/Either";

import { ITasksRepository } from "../repositories/ITasksRepository";
import { ISubjectsRepository } from "../repositories/ISubjectsRepository";
import { Subject } from "../entities/Subject";
import { IUsersRepository } from "../../accounts/repositories/IUsersRepository";
import { UserDoesNotExistError } from "../errors/UserDoesNotExistError";
import { ITaskData } from "../dtos/ITaskData";
import { Task } from "../entities/Task";
import { TaskDoesNotExistError } from "../errors/TaskDoesNotExistError";

interface IRequest {
  userId: string;
  taskId: string;
  taskName: string;
  subjectName: string;
}

interface IResponse extends ITaskData {
  subjectName: string;
}

@injectable()
export class UpdateTaskUseCase {
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
    taskName,
    subjectName,
  }: IRequest): Promise<
    Either<
      UserDoesNotExistError |
      TaskDoesNotExistError,
      IResponse
    >> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserDoesNotExistError())
    }

    const taskExists = await this.tasksRepository.findById(taskId);

    if (!taskExists) {
      return left(new TaskDoesNotExistError(taskId))
    }

    let subject = await this.subjectsRepository.findByName(subjectName);

    if (!subject) {
      const subjectToBeCreated = new Subject({
        name: subjectName,
        userId: userId,
      })

      subject = await this.subjectsRepository.create(subjectToBeCreated);
    };

    const taskToBeCreated = new Task({
      id: taskId,
      name: taskName,
      done: taskExists.done,
      subjectId: subject.id,
      userId,
      createdAt: taskExists.createdAt,
      updatedAt: new Date(),
    });

    const task = await this.tasksRepository.update(taskToBeCreated);

    const taskMapped = {
      ...task,
      subjectName: subject.name,
    }

    return right(taskMapped);
  }
}
