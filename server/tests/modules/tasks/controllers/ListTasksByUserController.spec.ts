import { container } from "tsyringe";

import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { ListTasksByUserController } from "../../../../src/modules/tasks/controllers/ListTasksByUserController";
import { Subject } from "../../../../src/modules/tasks/entities/Subject";
import { Task } from "../../../../src/modules/tasks/entities/Task";
import { ISubjectsRepository } from "../../../../src/modules/tasks/repositories/ISubjectsRepository";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";
import { SubjectsActions } from "../../../Doubles/SubjectsActions";
import { UsersActions } from "../../../Doubles/UsersActions";


describe("List Tasks By User Controller", () => {
  let listTasksByUserController: ListTasksByUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<ISubjectsRepository>("SubjectsRepository", SubjectsRepositoryInMemory);
    listTasksByUserController = new ListTasksByUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 and tasks on the body", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
    })

    const subject = new Subject({
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await subjectsActions.create(subject);

    const fakeRequest = {
      query: {
        subjectName: "Work"
      },
      user: {
        id: "user-id",
      }
    }

    const response = await listTasksByUserController.handle(fakeRequest);

    const expectedResponse = [subject];

    expect(response.body).toMatchObject(expectedResponse);
    expect(response.statusCode).toBe(200);
  });

  it("should return status code 403 if user does not exist", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
    })

    const subject = new Subject({
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await subjectsActions.create(subject);

    const invalidUserId = "invalidUserId";

    const fakeRequest = {
      query: {
        subjectName: "Work"
      },
      user: {
        id: invalidUserId,
      }
    }

    const response = await listTasksByUserController.handle(fakeRequest);

    expect(response.body).toEqual("User does not exist");
    expect(response.statusCode).toBe(403);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
    })

    const subject = new Subject({
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await subjectsActions.create(subject);

    const fakeRequest = {
      query: {
        subjectName: "Work"
      },
      user: {
      }
    }

    const response = await listTasksByUserController.handle(fakeRequest);

    expect(response.body).toEqual("User is not authenticated!");
    expect(response.statusCode).toBe(401);
  });

  it("should return status code 500 when a server error occurs", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
    })

    const subject = new Subject({
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await subjectsActions.create(subject);

    container.clearInstances();
    container.reset()

    const fakeRequest = {
      query: {
        subjectName: "Work"
      },
      user: {
        id: "user-id",
      }
    }

    const response = await listTasksByUserController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).not.toBe([subject]);
  });
});