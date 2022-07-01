import { Subject } from "../../../src/modules/tasks/entities/Subject";
import { ISubjectsRepository } from "../../../src/modules/tasks/repositories/ISubjectsRepository";

export class SubjectsRepositoryInMemory implements ISubjectsRepository {
  subjects: Subject[] = [];

  async create(data: Subject): Promise<Subject> {
    this.subjects.push(data);

    const subjectCreated = data;

    return subjectCreated;
  }

  async findByName(name: string): Promise<Subject | null> {
    const subject = this.subjects.find(subject => subject.name === name);

    return subject || null;
  }

  async findByUser(userId: string, subjectName: string | undefined): Promise<Subject[]> {
    let subjects = this.subjects.filter(subject => subject.userId === userId);

    if (subjectName) {
      subjects = subjects.filter(subject => subject.name === subjectName);
    };

    return subjects;
  }
}