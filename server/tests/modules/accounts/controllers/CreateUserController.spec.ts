import { container } from "tsyringe";
import { CreateUserController } from "../../../../src/modules/accounts/controllers/CreateUserController";
import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { UsersRepositoryInMemory } from "../Doubles/repositories/UsersRepositoryInMemory";


describe("Create User Controller", () => {
  let createUserController: CreateUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    createUserController = new CreateUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 201 and successful message when user is successfully created", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        password: "password",
        passwordConfirmation: "password"
      }
    }

    const response = await createUserController.handle(fakeRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBe("User Created!");
  });

  it("should return status code 403 when password and password confirmation are not matched", async () => {
    const fakeRequest = {
      body: {
        name: "John",
        password: "password",
        passwordConfirmation: "differentPassword"
      }
    }

    await createUserController.handle(fakeRequest);
    const result = await createUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`Password confirmation does not match password`);
  });

  it("should return status code 500 when a server error occurs", async () => {
    container.clearInstances();
    container.reset()

    const fakeRequest = {
      body: {
        name: "John",
        password: "password",
        passwordConfirmation: "password"
      }
    }

    const response = await createUserController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).not.toBe("User Created!");
  });
});