import { HttpRequest, controller, get, post } from "@athenajs/core";

@controller()
export class HelloController {
  @get("/hello")
  async hello(): Promise<{ hello: string }> {
    return { hello: "Hello, world!" };
  }

  @post("/hello")
  async helloFile(req: HttpRequest): Promise<string> {
    const data = await req.file();
    return `Successfully received file "${data?.filename}" and responded in plaintext`;
  }
}
