import { resolver, resolveQuery } from "@athenajs/core";

@resolver()
export class HelloResolver {
  @resolveQuery()
  async hello(): Promise<string> {
    return "hello, world!";
  }
}
