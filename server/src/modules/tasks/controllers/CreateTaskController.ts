import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { created, forbidden, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { CreateTaskUseCase } from "../useCases/CreateTaskUseCase";

export class CreateTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`TASK Creation with name: "${request.body.name}" and subject name: "${request.body.subjectName}" by user: "${request.user ? request.user.id : undefined}"`)
    try {
      const { name, subjectName } = request.body;

      if (!request.user || !request.user.id) {
        logger.warn(`TASK not created: User is not authenticated`);
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const createTaskUseCase = container.resolve(CreateTaskUseCase);

      const responseOrError = await createTaskUseCase.execute({ name, subjectName, userId });

      if (responseOrError.isRight()) {
        logger.verbose(`TASK created with id "${responseOrError.value.id}"`)
        return created(responseOrError.value);
      }

      logger.warn(`TASK not created: ${responseOrError.value.message}`)
      return forbidden(responseOrError.value.message);
    } catch (error) {
      logger.error(`TASK Creation Failed: ${error}`);
      return serverError(error);
    }
  }
}