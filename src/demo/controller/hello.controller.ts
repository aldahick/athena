import { controller, singleton } from "../..";

@singleton()
export class GetHelloController {
  @controller("get", "/v1/hello")
  hello() {
    return { message: "Hello, world!" };
  }
}
