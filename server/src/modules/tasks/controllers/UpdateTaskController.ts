import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, serverError, unauthorized, updated } from "../../../shared/utils/HttpResponses";
import { UpdateTaskUseCase } from "../useCases/UpdateTaskUseCase";

export class UpdateTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { taskName, subjectName } = request.body;
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
        subjectName
      });

      if (responseOrError.isRight()) {
        return updated(responseOrError.value);
      }

      return forbidden(responseOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}