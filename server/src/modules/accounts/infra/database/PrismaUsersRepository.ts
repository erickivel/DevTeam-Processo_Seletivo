import { prismaClient } from "../../../../shared/infra/database/prisma/PrismaClient";

import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: User): Promise<User> {
    const userCreated = await prismaClient.users.create({
      data: {
        id: data.id,
        name: data.name,
        password: data.password,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return userCreated;
  };

  async findByName(name: string): Promise<User | null> {
    const user = await prismaClient.users.findFirst({
      where: {
        name,
      }
    });

    return user;
  }
}