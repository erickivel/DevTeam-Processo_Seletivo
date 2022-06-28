export class PasswordDoesntMatchError extends Error {
  constructor() {
    super("Password confirmation does not match password");
    this.name = "PasswordDoesntMatchError";
  }
}
