import { controller, get, HttpRequest, HttpResponse } from "@athenajs/core";

@controller()
export class HelloController {
  @get("/hello")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async hello(
    req?: HttpRequest,
    res?: HttpResponse
  ): Promise<{ hello: string }> {
    return { hello: "Hello, world!" };
  }
}
