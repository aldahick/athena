import { resolveQuery, resolver } from "@athenajs/core";

@resolver()
export class HelloResolver {
  @resolveQuery()
  hello() {
    return Promise.resolve("hello, world!");
  }
}
