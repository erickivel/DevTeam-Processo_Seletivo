import { prismaClient } from "../../../../shared/infra/database/prisma/PrismaClient";

import { Subject } from "../../entities/Subject";
import { ISubjectsRepository } from "../../repositories/ISubjectsRepository";

export class PrismaSubjectsRepository implements ISubjectsRepository {
  async create(data: Subject): Promise<Subject> {
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

  async findByUser(userId: string, subjectName: string | undefined): Promise<Subject[]> {
    let subjects: Subject[] = [];

    if (subjectName) {
      subjects = await prismaClient.subjects.findMany({
        where: {
          userId,
          name: subjectName,
        },
        include: {
          Tasks: true,
        }
      });

    } else {
      subjects = await prismaClient.subjects.findMany({
        where: {
          userId,
        },
        include: {
          Tasks: true,
        }
      });
    }

    return subjects;
  }
}