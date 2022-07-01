import { User } from "../../../../src/modules/accounts/entities/User";
import { Subject } from "../../../../src/modules/tasks/entities/Subject";
import { Task } from "../../../../src/modules/tasks/entities/Task";
import { UserDoesNotExistError } from "../../../../src/modules/tasks/errors/UserDoesNotExistError";
import { ListTasksByUserUseCase } from "../../../../src/modules/tasks/useCases/ListTasksByUserUseCase";
import { SubjectsRepositoryInMemory } from "../../../Doubles/repositories/SubjectsRepositoryInMemory";
import { UsersRepositoryInMemory } from "../../../Doubles/repositories/UsersRepositoryInMemory";

describe("List Tasks by User UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let subjectsRepositoryInMemory: SubjectsRepositoryInMemory;
  let listTasksByUserUseCase: ListTasksByUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    subjectsRepositoryInMemory = new SubjectsRepositoryInMemory();
    listTasksByUserUseCase = new ListTasksByUserUseCase(
      usersRepositoryInMemory,
      subjectsRepositoryInMemory
    );
  })

  it("should list tasks by user", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
    })

    const subject = new Subject({
      name: "Subject Name",
      userId: task.userId,
      tasks: [task]
    })

    await subjectsRepositoryInMemory.create(subject);

    const responseOrError = await listTasksByUserUseCase.execute({
      userId: task.userId
    });

    const expectedResponse = [subject];

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toMatchObject(expectedResponse);
  });

  it("should list tasks by user and by some subject name", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task1 = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
    })

    const subject1 = new Subject({
      name: "Subject Name",
      userId: task1.userId,
      tasks: [task1]
    })

    const subject2 = new Subject({
      name: "Subject Name 2",
      userId: task1.userId,
      tasks: [task1]
    })

    await subjectsRepositoryInMemory.create(subject1);
    await subjectsRepositoryInMemory.create(subject2);

    const responseOrError = await listTasksByUserUseCase.execute({
      userId: user.id,
      subjectName: "Subject Name 2"
    });

    const expectedResponse = [subject2];

    expect(responseOrError.isRight()).toBeTruthy();
    expect(responseOrError.value).toMatchObject(expectedResponse);
  });

  it("should not list tasks if user does not exist", async () => {
    const user = new User({
      name: "John",
      password: "123456"
    });

    const userCreated = await usersRepositoryInMemory.create(user)

    const task = new Task({
      name: "Task Name",
      subjectId: "subjectId",
      userId: userCreated.id,
    })

    const subject = new Subject({
      name: "Subject Name",
      userId: task.userId,
      tasks: [task]
    })

    await subjectsRepositoryInMemory.create(subject);

    const invalidUserId = "invalidUserId";

    const responseOrError = await listTasksByUserUseCase.execute({
      userId: invalidUserId
    });

    expect(responseOrError.isLeft()).toBeTruthy();
    expect(responseOrError.value).toEqual(new UserDoesNotExistError());
  })
});