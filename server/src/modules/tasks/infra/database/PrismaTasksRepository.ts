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

  async findById(id: string): Promise<ITaskData | null> {
    const task = await prismaClient.tasks.findFirst({
      where: {
        id
      }
    });

    return task;
  }

  async update(data: Task): Promise<ITaskData> {
    const taskUpdated = await prismaClient.tasks.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        updatedAt: data.updatedAt,
        subjectId: data.subjectId,
      }
    });

    return taskUpdated;
  }
}