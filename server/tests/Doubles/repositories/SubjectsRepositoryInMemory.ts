import { ISubjectData } from "../../../src/modules/tasks/dtos/ISubjectData";
import { Subject } from "../../../src/modules/tasks/entities/Subject";
import { ISubjectsRepository } from "../../../src/modules/tasks/repositories/ISubjectsRepository";

export class SubjectsRepositoryInMemory implements ISubjectsRepository {
  subjects: Subject[] = [];

  async create(data: Subject): Promise<ISubjectData> {
    this.subjects.push(data);

    const subjectCreated = data;

    return subjectCreated;
  }

  async findByName(name: string): Promise<ISubjectData | null> {
    const subject = this.subjects.find(subject => subject.name === name);

    return subject || null;
  }
}