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
          tasks: true,
        }
      });

    } else {
      subjects = await prismaClient.subjects.findMany({
        where: {
          userId,
        },
        include: {
          tasks: true,
        }
      });
    }

    return subjects;
  }

  async findById(id: string): Promise<Subject | null> {
    const subject = await prismaClient.subjects.findFirst({
      where: {
        id,
      },
      include: {
        tasks: true,
      }
    });

    return subject;
  }

  async deleteOne(id: string): Promise<void> {
    await prismaClient.subjects.delete({
      where: {
        id
      }
    });
  }
}