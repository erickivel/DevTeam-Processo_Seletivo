import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { ListTasksByUserUseCase } from "../useCases/ListTasksByUserUseCase";

export class ListTasksByUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`TASK Listing by user: "${request.user ? request.user.id : undefined}"`)
    try {
      const { subjectName } = request.query;

      if (!request.user || !request.user.id) {
        logger.warn(`TASK not deleted: User is not authenticated`);
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const listTasksByUserUseCase = container.resolve(ListTasksByUserUseCase);

      const responseOrError = await listTasksByUserUseCase.execute({ userId, subjectName });

      if (responseOrError.isRight()) {
        logger.verbose(`TASK Listed ${responseOrError.value.length} subjects with tasks`);
        return ok(responseOrError.value);
      }

      logger.warn(`TASKs not listed: ${responseOrError.value.message}`)
      return forbidden(responseOrError.value.message);
    } catch (error) {
      logger.error(`TASK Listing Failed: ${error}`);
      return serverError(error);
    }
  }
}