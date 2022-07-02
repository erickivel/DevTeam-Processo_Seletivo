import { Subject } from "../entities/Subject";

export interface ISubjectsRepository {
  create(data: Subject): Promise<Subject>;
  findByName(name: string): Promise<Subject | null>;
  findByUser(userId: string, subjectName: string | undefined): Promise<Subject[]>;
  findById(id: string): Promise<Subject | null>;
  deleteOne(id: string): Promise<void>;
}
