import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { created, forbidden, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { CreateTaskUseCase } from "../useCases/CreateTaskUseCase";

export class CreateTaskController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { name, subjectName } = request.body;

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const createTaskUseCase = container.resolve(CreateTaskUseCase);

      const responseOrError = await createTaskUseCase.execute({ name, subjectName, userId });

      if (responseOrError.isRight()) {
        return created(responseOrError.value);
      }

      return forbidden(responseOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}