import { controller, singleton } from "../..";
import { ControllerPayload } from "../../registry/controller";

@singleton()
export class GetHelloController {
  @controller("get", "/v1/hello")
  hello({ req }: ControllerPayload<any>) {
    return { message: "Hello, world!", query: req.query };
  }
}
