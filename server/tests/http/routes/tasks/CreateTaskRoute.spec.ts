
import { hash } from "bcrypt";
import request from "supertest";

import { prismaClient } from "../../../../src/shared/infra/database/prisma/PrismaClient";
import { app } from "../../../../src/shared/infra/http/app";

describe("Create Task Route", () => {
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
  });

  afterAll(async () => {
    await prismaClient.tasks.deleteMany();
    await prismaClient.subjects.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 and the task when task is created", async () => {
    const responseToken = await request(app)
      .post("/users/sessions",)
      .send({
        name: "John",
        password: "secret",
      })

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/tasks")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Feature Report",
        subjectName: "Work"
      })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("subjectName");
    expect(response.body).toHaveProperty("done");
    expect(response.body).toHaveProperty("userId");
  })
});