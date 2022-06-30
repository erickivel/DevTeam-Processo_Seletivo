import { hash } from "bcrypt";
import request from "supertest";

import { prismaClient } from "../../../src/shared/infra/database/prisma/PrismaClient";
import { app } from "../../../src/shared/infra/http/app";

describe("Authenticate User Route", () => {
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
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and the token when user is authenticated", async () => {
    const response = await request(app)
      .post("/users/sessions",)
      .send({
        name: "John",
        password: "secret",
      })
      .expect(200);

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  })
});