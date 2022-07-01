
import { hash } from "bcrypt";
import request from "supertest";

import { prismaClient } from "../../../../src/shared/infra/database/prisma/PrismaClient";
import { app } from "../../../../src/shared/infra/http/app";

describe("List Tasks By User Route", () => {
  beforeAll(async () => {
    await prismaClient.$connect();

    const hashedPassword = await hash("secret", 8);

    await prismaClient.users.create({
      data: {
        id: "user-id",
        name: "John",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prismaClient.subjects.create({
      data: {
        id: "subject-id",
        name: "Subject Name",
        userId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prismaClient.tasks.create({
      data: {
        name: "Task Name",
        done: false,
        userId: "user-id",
        subjectId: "subject-id",
      }
    });
  });

  afterAll(async () => {
    await prismaClient.tasks.deleteMany();
    await prismaClient.subjects.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and the tasks", async () => {
    const responseToken = await request(app)
      .post("/users/sessions",)
      .send({
        name: "John",
        password: "secret",
      })

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/tasks")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .query({ subjectName: "Subject Name" })
      .expect(200);

    const expectedResponse = {
      id: "subject-id",
      name: "Subject Name",
      userId: "user-id",
      Tasks: [{
        name: "Task Name",
        done: false,
        subjectId: "subject-id",
      }]
    };


    expect(response.body[0]).toMatchObject(expectedResponse);
  })
});