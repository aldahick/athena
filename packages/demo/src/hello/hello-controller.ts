import { controller, get, HttpRequest, post } from "@athenajs/core";

@controller()
export class HelloController {
  @get("/hello")
  hello() {
    return Promise.resolve({ hello: "Hello, world!" });
  }

  @post("/hello")
  async helloFile(req: HttpRequest): Promise<string> {
    const data = await req.file();
    return `Successfully received file "${data?.filename}" and responded in plaintext`;
  }
}
