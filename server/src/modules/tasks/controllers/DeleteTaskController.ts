import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { DeleteTaskUseCase } from "../useCases/DeleteTaskUseCase";

export class DeleteTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { taskId } = request.params;

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const deleteTaskUseCase = container.resolve(DeleteTaskUseCase);

      const responseOrError = await deleteTaskUseCase.execute({
        userId,
        taskId,
      });

      if (responseOrError.isRight()) {
        return ok("Task successfully deleted");
      }

      return forbidden(responseOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}