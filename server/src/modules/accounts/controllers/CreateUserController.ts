import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { created, forbidden, serverError } from "../../../shared/utils/HttpResponses";
import { CreateUserUseCase } from "../useCases/CreateUserUseCase";

export class CreateUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { name, password, passwordConfirmation } = request.body;

      const createUserUseCase = container.resolve(CreateUserUseCase);

      const userOrError = await createUserUseCase.execute({ name, password, passwordConfirmation });

      if (userOrError.isRight()) {
        return created("User Created!");
      }

      return forbidden(userOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}