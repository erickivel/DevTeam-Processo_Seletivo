import { container } from "tsyringe";

import { IUsersRepository } from "../../../../src/modules/accounts/repositories/IUsersRepository";
import { DeleteTaskController } from "../../../../src/modules/tasks/controllers/DeleteTaskController";
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


describe("Delete Task Controller", () => {
  let deleteTaskController: DeleteTaskController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<ISubjectsRepository>("SubjectsRepository", SubjectsRepositoryInMemory);
    container.registerSingleton<ITasksRepository>("TasksRepository", TasksRepositoryInMemory);
    deleteTaskController = new DeleteTaskController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 if the task is successfully deleted", async () => {
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
      user: {
        id: "user-id",
      }
    }

    const response = await deleteTaskController.handle(fakeRequest);

    const taskDeleted = await tasksActions.findById(task.id);
    const subjectDeleted = await subjectsActions.findByName(subject.name)

    expect(response.body).toEqual("Task successfully deleted");
    expect(taskDeleted).toEqual(null);
    expect(subjectDeleted).toEqual(null);
    expect(response.statusCode).toBe(200);
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
      user: {
        id: invalidUserId,
      }
    }

    const response = await deleteTaskController.handle(fakeRequest);

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
      user: {
      }
    }

    const response = await deleteTaskController.handle(fakeRequest);

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
      user: {
        id: "user-id",
      }
    }

    const response = await deleteTaskController.handle(fakeRequest);

    expect(response.statusCode).toBe(500);
  });
});