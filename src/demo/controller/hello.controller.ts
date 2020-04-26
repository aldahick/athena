import { singleton } from "tsyringe";
import { controller } from "../../registry/controller";

@singleton()
export class GetHelloController {
  @controller("get", "/v1/hello")
  hello() {
    return { message: "Hello, world!" };
  }
}
