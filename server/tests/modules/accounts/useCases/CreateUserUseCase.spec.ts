import { PasswordDoesntMatchError } from "../../../../src/modules/accounts/errors/PasswordDoesntMatchError";
import { UserAlreadyExistsError } from "../../../../src/modules/accounts/errors/UserAlreadyExistsError";
import { CreateUserUseCase } from "../../../../src/modules/accounts/useCases/CreateUserUseCase";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("Create User UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should create a new user", async () => {
    const userToBeCreated = {
      name: "John",
      password: "secret",
      passwordConfirmation: "secret",
    }

    const userOrError = await createUserUseCase.execute(userToBeCreated);

    const createdUser = await usersRepositoryInMemory.findByName(userToBeCreated.name);

    expect(userOrError.isRight()).toBeTruthy();
    expect(createdUser).toHaveProperty("id");
    expect(createdUser?.password).not.toBe(userToBeCreated.password);
  })

  it("should not create a user if user name is already in use", async () => {
    const userToBeCreated = {
      name: "John",
      password: "secret",
      passwordConfirmation: "secret",
    }

    await createUserUseCase.execute(userToBeCreated);
    const userOrError = await createUserUseCase.execute(userToBeCreated);

    expect(userOrError.isLeft()).toBeTruthy();
    expect(userOrError.value).toEqual(new UserAlreadyExistsError());
  })

  it("should not create a new user if passwords are not matching", async () => {
    const userToBeCreated = {
      name: "John",
      password: "secret",
      passwordConfirmation: "anotherPassword",
    }

    const userOrError = await createUserUseCase.execute(userToBeCreated);

    const createdUser = await usersRepositoryInMemory.findByName(userToBeCreated.name);

    expect(userOrError.isLeft()).toBeTruthy();
    expect(createdUser).toEqual(null);
    expect(userOrError.value).toEqual(new PasswordDoesntMatchError());
  })
});