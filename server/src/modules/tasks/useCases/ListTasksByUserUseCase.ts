import { injectable, inject } from "tsyringe";

import { Either, left, right } from "../../../shared/logic/Either";

import { ISubjectsRepository } from "../repositories/ISubjectsRepository";
import { IUsersRepository } from "../../accounts/repositories/IUsersRepository";
import { UserDoesNotExistError } from "../errors/UserDoesNotExistError";
import { Subject } from "../entities/Subject";

interface IRequest {
  userId: string;
  subjectName?: string;
}

@injectable()
export class ListTasksByUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("SubjectsRepository")
    private subjectsRepository: ISubjectsRepository,
  ) { }
  async execute({
    userId,
    subjectName,
  }: IRequest): Promise<Either<UserDoesNotExistError, Subject[]>> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return left(new UserDoesNotExistError())
    }

    const subjects = await this.subjectsRepository.findByUser(userId, subjectName);

    return right(subjects);
  }
}
