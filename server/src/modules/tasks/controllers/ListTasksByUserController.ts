import { container } from "tsyringe";

import { IController } from "../../../shared/ports/IController";
import { IHttpRequest } from "../../../shared/ports/IHttpRequest";
import { IHttpResponse } from "../../../shared/ports/IHttpResponse";
import { forbidden, ok, serverError, unauthorized } from "../../../shared/utils/HttpResponses";
import { ListTasksByUserUseCase } from "../useCases/ListTasksByUserUseCase";

export class ListTasksByUserController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { subjectName } = request.query;

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      }

      const userId = request.user.id;

      const listTasksByUserUseCase = container.resolve(ListTasksByUserUseCase);

      const responseOrError = await listTasksByUserUseCase.execute({ userId, subjectName });

      if (responseOrError.isRight()) {
        return ok(responseOrError.value);
      }

      return forbidden(responseOrError.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}