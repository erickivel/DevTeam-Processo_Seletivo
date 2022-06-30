import { hash } from "bcrypt";
import { IncorrectCredentialsError } from "../../../../src/modules/accounts/errors/IncorrectCredentialsError";
import { AuthenticateUserUseCase } from "../../../../src/modules/accounts/useCases/AuthenticateUserUseCase";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("Authenticate User UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  })

  it("should authenticate a new user", async () => {
    const hashedPassword = await hash("secret", 8);

    await usersRepositoryInMemory.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const responseOrError = await authenticateUserUseCase.execute({
      name: "John",
      password: "secret",
    });

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toHaveProperty("user");
    expect(responseOrError.value).toHaveProperty("token");
  })

  it("should not authenticate user if a incorrect credential is provided", async () => {
    const hashedPassword = await hash("secret", 8);

    await usersRepositoryInMemory.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const incorrectName = await authenticateUserUseCase.execute({
      name: "incorrect name",
      password: "secret",
    });

    const incorrectPassword = await authenticateUserUseCase.execute({
      name: "John",
      password: "incorrectPassword",
    });

    expect(incorrectName.isLeft()).toBeTruthy();
    expect(incorrectName.value).toEqual(new IncorrectCredentialsError());
    expect(incorrectPassword.isLeft()).toBeTruthy();
    expect(incorrectPassword.value).toEqual(new IncorrectCredentialsError());
  })
});