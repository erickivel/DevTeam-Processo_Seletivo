import { container } from "tsyringe";

import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { UpdateTaskController } from "../../../../src/modules/tasks/controllers/UpdateTaskController";
import { Subject } from "../../../../src/modules/tasks/entities/Subject";
import { Task } from "../../../../src/modules/tasks/entities/Task";
import { ISubjectsRepository } from "../../../../src/modules/tasks/repositories/ISubjectsRepository";
import { ITasksRepository } from "../../../../src/modules/tasks/repositories/ITasksRepository";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { TasksRepositoryInMemory } from "../../../Doubles/repositories/TasksRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";
import { SubjectsActions } from "../../../Doubles/SubjectsActions";
import { TasksActions } from "../../../Doubles/TasksActions";
import { UsersActions } from "../../../Doubles/UsersActions";


describe("Update Task Controller", () => {
  let updateTaskController: UpdateTaskController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<ISubjectsRepository>("SubjectsRepository", SubjectsRepositoryInMemory);
    container.registerSingleton<ITasksRepository>("TasksRepository", TasksRepositoryInMemory);
    updateTaskController = new UpdateTaskController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and the task updated on the body", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);
    const tasksActions = container.resolve(TasksActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20"),
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await tasksActions.create(task);
    await subjectsActions.create(subject);

    const fakeRequest = {
      params: {
        taskId: task.id
      },
      body: {
        taskName: "New Task Name",
        subjectName: "New Subject Name",
        done: true
      },
      user: {
        id: "user-id",
      }
    }

    const response = await updateTaskController.handle(fakeRequest);

    const taskUpdated = await tasksActions.findById(task.id);

    const expectedResponse = {
      id: "task-id",
      name: "New Task Name",
      subjectName: "New Subject Name",
      done: true
    };

    expect(response.body).toMatchObject(expectedResponse);
    expect(taskUpdated?.name).toEqual("New Task Name");
    expect(taskUpdated?.updatedAt).not.toEqual(task.updatedAt);
    expect(taskUpdated?.createdAt).toEqual(task.createdAt);
    expect(response.statusCode).toBe(201);
  });

  it("should return status code 403 if user does not exist", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);
    const tasksActions = container.resolve(TasksActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20"),
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await tasksActions.create(task);
    await subjectsActions.create(subject);

    const invalidUserId = "invalidUserId";

    const fakeRequest = {
      params: {
        taskId: task.id
      },
      body: {
        taskName: "New Task Name",
        subjectName: "New Subject Name",
        done: true,
      },
      user: {
        id: invalidUserId,
      }
    }

    const response = await updateTaskController.handle(fakeRequest);

    expect(response.body).toEqual("User does not exist");
    expect(response.statusCode).toBe(403);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);
    const tasksActions = container.resolve(TasksActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20"),
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await tasksActions.create(task);
    await subjectsActions.create(subject);

    const fakeRequest = {
      params: {
        taskId: task.id
      },
      body: {
        taskName: "New Task Name",
        subjectName: "New Subject Name",
        done: true
      },
      user: {
      }
    }

    const response = await updateTaskController.handle(fakeRequest);

    expect(response.body).toEqual("User is not authenticated!");
    expect(response.statusCode).toBe(401);
  });

  it("should return status code 500 when a server error occurs", async () => {
    const usersActions = container.resolve(UsersActions);
    const subjectsActions = container.resolve(SubjectsActions);
    const tasksActions = container.resolve(TasksActions);

    await usersActions.create({
      id: "user-id",
      name: "John",
      password: "secret",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: "user-id",
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20"),
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Work",
      userId: "user-id",
      tasks: [task]
    })

    await tasksActions.create(task);
    await subjectsActions.create(subject);

    container.clearInstances();
    container.reset()

    const fakeRequest = {
      params: {
        taskId: task.id
      },
      body: {
        taskName: "New Task Name",
        subjectName: "New Subject Name",
        done: true
      },
      user: {
        id: "user-id",
      }
    }

    const response = await updateTaskController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
  });
});