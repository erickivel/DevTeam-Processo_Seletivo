import { prismaClient } from "../../../../shared/infra/database/prisma/PrismaClient";

import { ITaskData } from "../../dtos/ITaskData";
import { Task } from "../../entities/Task";
import { ITasksRepository } from "../../repositories/ITasksRepository";

export class PrismaTasksRepository implements ITasksRepository {
  async create(data: Task): Promise<ITaskData> {
    const taskCreated = await prismaClient.tasks.create({
      data: {
        id: data.id,
        name: data.name,
        done: data.done,
        subjectId: data.subjectId,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return taskCreated;
  };

  async findByName(name: string): Promise<ITaskData | null> {
    const task = await prismaClient.tasks.findFirst({
      where: {
        name
      }
    });

    return task;
  }
}