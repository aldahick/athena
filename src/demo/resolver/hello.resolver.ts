import { singleton, query } from "../..";

@singleton()
export class HelloResolver {
  @query()
  hello(): string {
    return "Hello, world!";
  }
}
