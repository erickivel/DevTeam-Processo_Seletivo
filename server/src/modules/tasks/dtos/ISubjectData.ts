import { User } from "../../accounts/entities/User";
import { ITaskData } from "./ITaskData";

export interface ISubjectData {
  id: string;
  name: string;
  userId: string;
  user?: User;
  tasks?: ITaskData[];
  createdAt: Date;
  updatedAt: Date;
}