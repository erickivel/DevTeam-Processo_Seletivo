export class TaskDoesNotExistError extends Error {
  constructor(id: string) {
    super(`Task with id "${id}" does not exist`);
    this.name = "TaskDoesNotExistError";
  }
}