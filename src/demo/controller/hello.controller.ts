import { controller, ControllerPayload, singleton } from "../..";
import { guard } from "../../registry/auth";

@singleton()
export class GetHelloController {
  @controller("get", "/v1/hello")
  hello({ req }: ControllerPayload): Record<string, unknown> {
    return { message: "Hello, world!", query: req.query };
  }

  @guard({
    resource: "hello",
    action: "readAny"
  })
  @controller("get", "/v1/hello/authed")
  helloAuthed(payload: ControllerPayload): Record<string, unknown> {
    return this.hello(payload);
  }
}
