import { inject, injectable } from "tsyringe";
import { Subject } from "../../src/modules/tasks/entities/Subject";
import { ISubjectsRepository } from "../../src/modules/tasks/repositories/ISubjectsRepository";


@injectable()
export class SubjectsActions {
  constructor(
    @inject("SubjectsRepository")
    private subjectsRepository: ISubjectsRepository,
  ) { }

  async create(data: Subject): Promise<Subject> {
    const subject = await this.subjectsRepository.create(data);

    return subject;
  };
};