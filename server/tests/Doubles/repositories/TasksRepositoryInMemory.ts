import { ITaskData } from "../../../src/modules/tasks/dtos/ITaskData";
import { Task } from "../../../src/modules/tasks/entities/Task";
import { ITasksRepository } from "../../../src/modules/tasks/repositories/ITasksRepository";

export class TasksRepositoryInMemory implements ITasksRepository {
  tasks: Task[] = [];

  async create(data: Task): Promise<ITaskData> {
    this.tasks.push(data);

    const taskCreated = data;

    return taskCreated;
  }

  async findByName(name: string): Promise<ITaskData | null> {
    const task = this.tasks.find(task => task.name === name);

    return task || null;
  }
}