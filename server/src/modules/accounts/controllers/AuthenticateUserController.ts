import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError } from "../../../shared/utils/HttpResponses";
import { AuthenticateUserUseCase } from "../useCases/AuthenticateUserUseCase";

export class AuthenticateUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`USER Authenticating with name "${request.body.name}"`)
    try {
      const { name, password } = request.body;

      const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

      const responseOrError = await authenticateUserUseCase.execute({ name, password });

      if (responseOrError.isRight()) {
        logger.verbose(`USER Authenticated with name "${name}"`)
        return ok(responseOrError.value);
      }

      logger.warn(`USER not authenticated: ${responseOrError.value.message}`)
      return forbidden(responseOrError.value.message);
    } catch (error) {
      logger.error(`USER Authentication Failed: ${error}`);
      return serverError(error);
    }
  }
}