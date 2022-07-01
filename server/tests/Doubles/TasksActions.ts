import { inject, injectable } from "tsyringe";
import { ITaskData } from "../../src/modules/tasks/dtos/ITaskData";
import { Task } from "../../src/modules/tasks/entities/Task";
import { ITasksRepository } from "../../src/modules/tasks/repositories/ITasksRepository";


@injectable()
export class TasksActions {
  constructor(
    @inject("TasksRepository")
    private tasksRepository: ITasksRepository,
  ) { }

  async create(data: Task): Promise<ITaskData> {
    const task = await this.tasksRepository.create(data);

    return task;
  };

  async findById(id: string): Promise<ITaskData | null> {
    return await this.tasksRepository.findById(id);
  }
};