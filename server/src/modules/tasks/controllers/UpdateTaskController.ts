import { container } from "tsyringe";
import { logger } from "../../../shared/infra/http/logger";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, serverError, unauthorized, updated } from "../../../shared/utils/HttpResponses";
import { UpdateTaskUseCase } from "../useCases/UpdateTaskUseCase";

export class UpdateTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    logger.info(`TASK Updating with id: "${request.params.taskId}" , name: "${request.body.taskName}" and subject name: "${request.body.subjectName}" by user: "${request.user ? request.user.id : undefined}"`)
    try {
      const { taskName, subjectName, done } = request.body;
      const { taskId } = request.params;

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const updateTaskUseCase = container.resolve(UpdateTaskUseCase);

      const responseOrError = await updateTaskUseCase.execute({
        userId,
        taskId,
        taskName,
        subjectName,
        done
      });

      if (responseOrError.isRight()) {
        logger.verbose(`TASK Updated successfully with id: "${responseOrError.value.id}" , name: "${responseOrError.value.name}" and subject name: "${responseOrError.value.subjectName}" by user: "${request.user ? request.user.id : undefined}"`)
        return updated(responseOrError.value);
      }

      logger.warn(`TASK not updated: ${responseOrError.value.message}`)
      return forbidden(responseOrError.value.message);
    } catch (error) {
      logger.error(`TASK Update Failed: ${error}`);
      return serverError(error);
    }
  }
}