import { User } from "../../../../src/modules/accounts/entities/User";
import { Subject } from "../../../../src/modules/tasks/entities/Subject";
import { Task } from "../../../../src/modules/tasks/entities/Task";
import { TaskDoesNotExistError } from "../../../../src/modules/tasks/errors/TaskDoesNotExistError";
import { UserDoesNotExistError } from "../../../../src/modules/tasks/errors/UserDoesNotExistError";
import { DeleteTaskUseCase } from "../../../../src/modules/tasks/useCases/DeleteTaskUseCase";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { TasksRepositoryInMemory } from "../../../Doubles/repositories/TasksRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("Delete Task UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let subjectsRepositoryInMemory: SubjectsRepositoryInMemory;
  let tasksRepositoryInMemory: TasksRepositoryInMemory;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    subjectsRepositoryInMemory = new SubjectsRepositoryInMemory();
    tasksRepositoryInMemory = new TasksRepositoryInMemory();
    deleteTaskUseCase = new DeleteTaskUseCase(
      usersRepositoryInMemory,
      tasksRepositoryInMemory,
      subjectsRepositoryInMemory
    );
  })

  it("should delete a task", async () => {
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

    const task2 = new Task({
      id: "task-id-2",
      name: "Task Name 2",
      subjectId: "subjectId",
      userId: userCreated.id,
      createdAt: new Date("2020-05-20"),
      updatedAt: new Date("2020-05-20")
    })

    const subject = new Subject({
      id: "subjectId",
      name: "Subject Name",
      userId: task.userId,
      tasks: [task, task2]
    })

    await subjectsRepositoryInMemory.create(subject);
    await tasksRepositoryInMemory.create(task);
    await tasksRepositoryInMemory.create(task2);

    const responseOrError = await deleteTaskUseCase.execute({
      userId: user.id,
      taskId: "task-id"
    });

    const tasks = tasksRepositoryInMemory.tasks;

    const expectedResponse = [
      {
        ...task2
      }
    ];

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toEqual(null);
    expect(tasks.length).toEqual(1);
    expect(tasks).toMatchObject(expectedResponse);
  });

  it("should delete the subject after delete its last task", async () => {
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

    await subjectsRepositoryInMemory.create(subject);
    await tasksRepositoryInMemory.create(task);

    const responseOrError = await deleteTaskUseCase.execute({
      userId: user.id,
      taskId: "task-id"
    });

    const tasks = tasksRepositoryInMemory.tasks;
    const subjects = subjectsRepositoryInMemory.subjects;

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toEqual(null);
    expect(tasks.length).toEqual(0);
    expect(subjects.length).toEqual(0);
  });

  it("should not delete the task if user does not exist", async () => {
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

    await subjectsRepositoryInMemory.create(subject);
    await tasksRepositoryInMemory.create(task);

    const invalidUserId = "invalidUserId";

    const responseOrError = await deleteTaskUseCase.execute({
      userId: invalidUserId,
      taskId: "task-id"
    });

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new UserDoesNotExistError());
  });

  it("should not delete the task if task does not exist", async () => {
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

    await subjectsRepositoryInMemory.create(subject);
    await tasksRepositoryInMemory.create(task);

    const invalidTaskId = "invalidTaskId";

    const responseOrError = await deleteTaskUseCase.execute({
      userId: user.id,
      taskId: invalidTaskId
    });

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new TaskDoesNotExistError(invalidTaskId));
  });
});