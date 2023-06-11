import { controller, get } from "@athenajs/core";

@controller()
export class HelloController {
  @get("/hello")
  async hello(): Promise<{ hello: string }> {
    return { hello: "Hello, world!" };
  }
}
