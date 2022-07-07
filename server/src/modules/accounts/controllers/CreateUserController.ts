import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { created, forbidden, serverError } from "../../../shared/utils/HttpResponses";
import { CreateUserUseCase } from "../useCases/CreateUserUseCase";

export class CreateUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`USER Starting creation with name "${request.body.name}"`)
    try {
      const { name, password, passwordConfirmation } = request.body;

      const createUserUseCase = container.resolve(CreateUserUseCase);

      const userOrError = await createUserUseCase.execute({ name, password, passwordConfirmation });

      if (userOrError.isRight()) {
        logger.verbose(`USER Created with name ${name} and id ${userOrError.value.id}`)
        return created("User Created!");
      }

      logger.warn(`USER not created: ${userOrError.value.message}`)
      return forbidden(userOrError.value.message);
    } catch (error: any) {
      logger.error(`USER Creation Failed: ${error}`);
      return serverError(error);
    }
  }
}