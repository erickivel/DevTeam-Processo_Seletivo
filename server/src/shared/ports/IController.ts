import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IController {
  handle(request: IHttpRequest): Promise<IHttpResponse>
}