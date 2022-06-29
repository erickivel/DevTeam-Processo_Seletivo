import request from "supertest";

import { prismaClient } from "../../../src/shared/infra/database/prisma/PrismaClient";
import { app } from "../../../src/shared/infra/http/app";

describe("Create User Route", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 and the user when user is created", async () => {
    const response = await request(app)
      .post("/users",)
      .send({
        name: "User Name",
        password: "secretPassword",
        passwordConfirmation: "secretPassword"
      })
      .expect(201);

    const createdUser = await prismaClient.users.findMany()

    expect(createdUser[0]).toHaveProperty("id");
    expect(createdUser[0].password).not.toEqual("secretPassword");
    expect(response.body).toEqual("User Created!");
  })
});