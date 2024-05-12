import { resolveQuery, resolver } from "@athenajs/core";

@resolver()
export class HelloResolver {
  @resolveQuery()
  hello(): Promise<string> {
    return Promise.resolve("hello, world!");
  }
}
