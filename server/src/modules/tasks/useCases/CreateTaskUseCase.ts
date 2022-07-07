import { injectable, inject } from "tsyringe";

import { Either, left, right } from "../../../shared/logic/Either";

import { ITasksRepository } from "../repositories/ITasksRepository";
import { ISubjectsRepository } from "../repositories/ISubjectsRepository";
import { Subject } from "../entities/Subject";
import { IUsersRepository } from "../../accounts/repositories/IUsersRepository";
import { UserDoesNotExistError } from "../errors/UserDoesNotExistError";
import { ITaskData } from "../dtos/ITaskData";
import { Task } from "../entities/Task";

interface IRequest {
  userId: string;
  name: string;
  subjectName: string;
}

interface IResponse extends ITaskData {
  subjectName: string;
}

@injectable()
export class CreateTaskUseCase {
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
    name,
    subjectName,
  }: IRequest): Promise<Either<UserDoesNotExistError, IResponse>> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserDoesNotExistError())
    }

    const subjectsByUser = await this.subjectsRepository.findByUser(userId, undefined);

    let subject = subjectsByUser.find(s => s.name === subjectName);

    if (!subject) {
      const subjectToBeCreated = new Subject({
        name: subjectName,
        userId: userId,
      })

      subject = await this.subjectsRepository.create(subjectToBeCreated);
    };

    const taskToBeCreated = new Task({
      name,
      subjectId: subject.id,
      userId,
    });

    const task = await this.tasksRepository.create(taskToBeCreated);

    const taskMapped = {
      ...task,
      subjectName: subject.name,
    }

    return right(taskMapped);
  }
}
