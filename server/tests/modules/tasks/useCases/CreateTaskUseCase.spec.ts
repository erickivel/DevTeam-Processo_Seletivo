import { hash } from "bcrypt";
import { UserDoesNotExistError } from "../../../../src/modules/tasks/errors/UserDoesNotExistError";
import { CreateTaskUseCase } from "../../../../src/modules/tasks/useCases/CreateTaskUseCase";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { TasksRepositoryInMemory } from "../../../Doubles/repositories/TasksRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("Create Task UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let tasksRepositoryInMemory: TasksRepositoryInMemory;
  let subjectsRepositoryInMemory: SubjectsRepositoryInMemory;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    tasksRepositoryInMemory = new TasksRepositoryInMemory();
    subjectsRepositoryInMemory = new SubjectsRepositoryInMemory();
    createTaskUseCase = new CreateTaskUseCase(
      usersRepositoryInMemory,
      tasksRepositoryInMemory,
      subjectsRepositoryInMemory
    );
  })

  it("should create a new task", async () => {
    const hashedPassword = await hash("secret", 8);

    await usersRepositoryInMemory.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const taskToBeCreated = {
      userId: "user-id",
      name: "Wash the car",
      subjectName: "Home"
    }

    const responseOrError = await createTaskUseCase.execute(taskToBeCreated);

    const createdTask = await tasksRepositoryInMemory.findByName(taskToBeCreated.name);

    const expectedResponse = {
      name: "Wash the car",
      done: false,
      userId: "user-id",
      subjectName: "Home"
    }

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toMatchObject(expectedResponse);
    expect(createdTask).toHaveProperty("id");
    expect(createdTask).toHaveProperty("name");
  });

  it("should not create a new subject if it already exists", async () => {
    const hashedPassword = await hash("secret", 8);

    await usersRepositoryInMemory.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await subjectsRepositoryInMemory.create({
      id: "subject-id",
      userId: "user-id",
      name: "Home",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const taskToBeCreated = {
      userId: "user-id",
      name: "Wash the car",
      subjectName: "Home"
    }

    const responseOrError = await createTaskUseCase.execute(taskToBeCreated);

    const subjects = subjectsRepositoryInMemory.subjects;

    const expectedResponse = {
      name: "Wash the car",
      done: false,
      userId: "user-id",
      subjectName: "Home"
    }

    console.log(subjects);

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toMatchObject(expectedResponse);
    expect(subjects.length).toEqual(1);
  })

  it("should not create a new task if user does not exist", async () => {
    const hashedPassword = await hash("secret", 8);

    await usersRepositoryInMemory.create({
      id: "user-id",
      name: "John",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invalidUserId = "invalid-user-id";

    const taskToBeCreated = {
      userId: invalidUserId,
      name: "Wash the car",
      subjectName: "Home"
    }

    const responseOrError = await createTaskUseCase.execute(taskToBeCreated);

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new UserDoesNotExistError());
  })
});