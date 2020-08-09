import { query, singleton } from "../..";

@singleton()
export class HelloResolver {
  @query()
  hello(): string {
    return "Hello, world!";
  }
}
