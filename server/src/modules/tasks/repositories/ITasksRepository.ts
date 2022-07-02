import { ITaskData } from "../dtos/ITaskData";
import { Task } from "../entities/Task";

export interface ITasksRepository {
  create(data: Task): Promise<ITaskData>;
  findByName(name: string): Promise<ITaskData | null>;
  findById(id: string): Promise<ITaskData | null>;
  update(data: Task): Promise<ITaskData>;
  deleteOne(id: string): Promise<void>;
}
