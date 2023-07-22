import {
  controller,
  get,
  HttpRequest,
  HttpResponse,
  post,
} from "@athenajs/core";

@controller()
export class HelloController {
  @get("/hello")
  async hello(
    req?: HttpRequest,
    res?: HttpResponse,
  ): Promise<{ hello: string }> {
    console.log("responding to request", req?.id, "sent:", res?.sent);
    return { hello: "Hello, world!" };
  }

  @post("/hello")
  async helloFile(req: HttpRequest): Promise<string> {
    const data = await req.file();
    return `Successfully received file "${data?.filename}" and responded in plaintext`;
  }
}
