import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError } from "../../../shared/utils/HttpResponses";
import { AuthenticateUserUseCase } from "../useCases/AuthenticateUserUseCase";

export class AuthenticateUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { name, password } = request.body;

      const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

      const responseOrError = await authenticateUserUseCase.execute({ name, password });

      if (responseOrError.isRight()) {
        return ok(responseOrError.value);
      }

      return forbidden(responseOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}