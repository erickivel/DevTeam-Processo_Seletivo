export class IncorrectCredentialsError extends Error {
  constructor() {
    super("Name or password incorrect");
    this.name = "IncorrectCredentialsError";
  }
};