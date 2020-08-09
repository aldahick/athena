import { controller, ControllerPayload, singleton } from "../..";

@singleton()
export class GetHelloController {
  @controller("get", "/v1/hello")
  hello({ req }: ControllerPayload): Record<string, unknown> {
    return { message: "Hello, world!", query: req.query };
  }
}
