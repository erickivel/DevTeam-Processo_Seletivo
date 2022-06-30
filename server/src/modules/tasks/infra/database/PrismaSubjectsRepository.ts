import { prismaClient } from "../../../../shared/infra/database/prisma/PrismaClient";

import { Subject } from "../../entities/Subject";
import { ISubjectData } from "../../dtos/ISubjectData";
import { ISubjectsRepository } from "../../repositories/ISubjectsRepository";

export class PrismaSubjectsRepository implements ISubjectsRepository {
  async create(data: Subject): Promise<ISubjectData> {
    const subjectCreated = await prismaClient.subjects.create({
      data: {
        id: data.id,
        name: data.name,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return subjectCreated;
  };

  async findByName(name: string): Promise<Subject | null> {
    const subject = await prismaClient.subjects.findFirst({
      where: {
        name,
      }
    });

    return subject;
  }
}