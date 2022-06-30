import { ITaskData } from "../dtos/ITaskData";
import { Task } from "../entities/Task";

export interface ITasksRepository {
  create(data: Task): Promise<ITaskData>;
  findByName(name: string): Promise<ITaskData | null>;
}
