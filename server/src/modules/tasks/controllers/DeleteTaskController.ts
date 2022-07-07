import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { DeleteTaskUseCase } from "../useCases/DeleteTaskUseCase";

export class DeleteTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`TASK Deletion with id: "${request.params.taskId}" by user: "${request.user ? request.user.id : undefined}"`)
    try {
      const { taskId } = request.params;

      if (!request.user || !request.user.id) {
        logger.warn(`TASK not deleted: User is not authenticated`);
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const deleteTaskUseCase = container.resolve(DeleteTaskUseCase);

      const responseOrError = await deleteTaskUseCase.execute({
        userId,
        taskId,
      });

      if (responseOrError.isRight()) {
        logger.verbose(`TASK with id "${taskId}" successfully deleted `);
        return ok("Task successfully deleted");
      }

      logger.warn(`TASK not deleted: ${responseOrError.value.message}`)
      return forbidden(responseOrError.value.message);
    } catch (error) {
      logger.error(`TASK Deletion Failed: ${error}`);
      return serverError(error);
    }
  }
}