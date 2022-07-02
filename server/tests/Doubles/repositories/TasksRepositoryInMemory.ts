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

  async findById(id: string): Promise<ITaskData | null> {
    const task = this.tasks.find(task => task.id === id);

    return task || null;
  }
  async update(data: Task): Promise<ITaskData> {
    const taskIndex = this.tasks.findIndex(task => task.id === data.id);

    this.tasks[taskIndex] = data;

    return this.tasks[taskIndex];
  }

  async deleteOne(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    this.tasks.splice(taskIndex, 1);
  }
}