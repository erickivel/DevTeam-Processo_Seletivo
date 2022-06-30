import { Subject } from "../entities/Subject";
import { ISubjectData } from "../dtos/ISubjectData";

export interface ISubjectsRepository {
  create(data: Subject): Promise<ISubjectData>;
  findByName(name: string): Promise<ISubjectData | null>;
}
