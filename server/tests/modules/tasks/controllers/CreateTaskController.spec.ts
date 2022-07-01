import { container } from "tsyringe";

import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { CreateTaskController } from "../../../../src/modules/tasks/controllers/CreateTaskController";
import { ISubjectsRepository } from "../../../../src/modules/tasks/repositories/ISubjectsRepository";
import { ITasksRepository } from "../../../../src/modules/tasks/repositories/ITasksRepository";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { TasksRepositoryInMemory } from "../../../Doubles/repositories/TasksRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../../../Doubles/UsersActions";


describe("Create Task Controller", () => {
  let createTaskController: CreateTaskController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<ITasksRepository>("TasksRepository", TasksRepositoryInMemory);
    container.registerSingleton<ISubjectsRepository>("SubjectsRepository", SubjectsRepositoryInMemory);
    createTaskController = new CreateTaskController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and successful message when task is successfully created", async () => {
    const usersActions = container.resolve(UsersActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequest = {
      body: {
        name: "Feature Report",
        subjectName: "Work"
      },
      user: {
        id: "user-id",
      }
    }

    const response = await createTaskController.handle(fakeRequest);

    const expectedResponse = {
      name: "Feature Report",
      subjectName: "Work",
      userId: "user-id",
      done: false,
    };

    expect(response.body).toMatchObject(expectedResponse);
    expect(response.statusCode).toBe(201);
  });

  it("should return status code 403 if user does not exist", async () => {
    const usersActions = container.resolve(UsersActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invalidUserId = "invalid-user-id";

    const fakeRequest = {
      body: {
        name: "Feature Report",
        subjectName: "Work"
      },
      user: {
        id: invalidUserId,
      }
    }

    const response = await createTaskController.handle(fakeRequest);

    expect(response.body).toEqual("User does not exist");
    expect(response.statusCode).toBe(403);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const usersActions = container.resolve(UsersActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequest = {
      body: {
        name: "Feature Report",
        subjectName: "Work"
      },
      user: {
      }
    }

    const response = await createTaskController.handle(fakeRequest);

    expect(response.body).toEqual("User is not authenticated!");
    expect(response.statusCode).toBe(401);
  });

  it("should return status code 500 when a server error occurs", async () => {
    const usersActions = container.resolve(UsersActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    container.clearInstances();
    container.reset()

    const fakeRequest = {
      body: {
        name: "Feature Report",
        subjectName: "Work"
      },
      user: {
        id: "user-id",
      }
    }

    const response = await createTaskController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
  });
});