export class UserAlreadyExistsError extends Error {
  constructor() {
    super("This user name is already taken");
    this.name = "UserAlreadyExistsError";
  }
};