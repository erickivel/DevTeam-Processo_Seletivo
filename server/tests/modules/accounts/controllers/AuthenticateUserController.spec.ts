import { hash } from "bcrypt";
import { container } from "tsyringe";
import { AuthenticateUserController } from "../../../../src/modules/accounts/controllers/AuthenticateUserController";
import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../../Doubles/UsersActions";


describe("Authenticate User Controller", () => {
  let authenticateUserController: AuthenticateUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    authenticateUserController = new AuthenticateUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 and user and token on the body when user is successfully authenticated", async () => {
    const usersActions = container.resolve(UsersActions);

    const hashedPassword = await hash("secret", 8);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequest = {
      body: {
        name: "John",
        password: "secret",
      }
    }

    const response = await authenticateUserController.handle(fakeRequest);

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
    expect(response.statusCode).toBe(200);
  });

  it("should return status code 403 if incorrect credentials are provided", async () => {
    const usersActions = container.resolve(UsersActions);

    const hashedPassword = await hash("secret", 8);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequestIncorrectName = {
      body: {
        name: "incorrectName",
        password: "secret",
      }
    }

    const fakeRequestIncorrectPassword = {
      body: {
        name: "John",
        password: "incorrectPassword",
      }
    }

    const responseIncorrectName = await authenticateUserController.handle(fakeRequestIncorrectName);
    const responseIncorrectPassword = await authenticateUserController.handle(fakeRequestIncorrectPassword);

    expect(responseIncorrectName.body).toEqual("Name or password incorrect");
    expect(responseIncorrectName.statusCode).toBe(403);
    expect(responseIncorrectPassword.body).toEqual("Name or password incorrect");
    expect(responseIncorrectPassword.statusCode).toBe(403);
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

    const response = await authenticateUserController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).not.toHaveProperty("token");
  });
});