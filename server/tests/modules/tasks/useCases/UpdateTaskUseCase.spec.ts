import { User } from "../../../../src/modules/accounts/entities/User";
import { Subject } from "../../../../src/modules/tasks/entities/Subject";
import { Task } from "../../../../src/modules/tasks/entities/Task";
import { TaskDoesNotExistError } from "../../../../src/modules/tasks/errors/TaskDoesNotExistError";
import { UserDoesNotExistError } from "../../../../src/modules/tasks/errors/UserDoesNotExistError";
import { UpdateTaskUseCase } from "../../../../src/modules/tasks/useCases/UpdateTaskUseCase";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { TasksRepositoryInMemory } from "../../../Doubles/repositories/TasksRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("Update Task UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let subjectsRepositoryInMemory: SubjectsRepositoryInMemory;
  let tasksRepositoryInMemory: TasksRepositoryInMemory;
  let updateTaskUseCase: UpdateTaskUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    subjectsRepositoryInMemory = new SubjectsRepositoryInMemory();
    tasksRepositoryInMemory = new TasksRepositoryInMemory();
    updateTaskUseCase = new UpdateTaskUseCase(
      usersRepositoryInMemory,
      tasksRepositoryInMemory,
      subjectsRepositoryInMemory
    );
  })

  it("should update a task", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20")
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Subject Name",
      userId: task.userId,
      tasks: [task]
    })

    await tasksRepositoryInMemory.create(task);
    await subjectsRepositoryInMemory.create(subject);

    const responseOrError = await updateTaskUseCase.execute({
      userId: user.id,
      taskId: "task-id",
      taskName: "New Task Name",
      done: true,
      subjectName: "New Subject Name"
    });

    const taskUpdated = await tasksRepositoryInMemory.findById("task-id");

    const expectedResponse = {
      id: "task-id",
      name: "New Task Name",
      done: true
    };

    expect(responseOrError.isRight()).toBeTruthy();
    if (responseOrError.isRight()) {
      expect(responseOrError.value.subjectName).toEqual("New Subject Name");
    }
    expect(taskUpdated).toMatchObject(expectedResponse);
    expect(taskUpdated?.updatedAt).not.toEqual(task.updatedAt);
    expect(taskUpdated?.createdAt).toEqual(task.createdAt);
  });

  it("should not update a task if task does not exist", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Subject Name",
      userId: task.userId,
      tasks: [task]
    })

    await tasksRepositoryInMemory.create(task);
    await subjectsRepositoryInMemory.create(subject);

    const invalidTaskId = "invalidTaskId"

    const responseOrError = await updateTaskUseCase.execute({
      userId: user.id,
      taskId: invalidTaskId,
      taskName: "New Task Name",
      subjectName: "New Subject Name",
      done: true,
    });

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new TaskDoesNotExistError(invalidTaskId));
  });

  it("should not update a task if user does not exist", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task = new Task({
      id: "task-id",
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Subject Name",
      userId: task.userId,
      tasks: [task]
    })

    await tasksRepositoryInMemory.create(task);
    await subjectsRepositoryInMemory.create(subject);

    const invalidUserId = "invalidUserId";

    const responseOrError = await updateTaskUseCase.execute({
      userId: invalidUserId,
      taskId: "task-id",
      taskName: "New Task Name",
      subjectName: "New Subject Name",
      done: true,
    });

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new UserDoesNotExistError());
  })
});