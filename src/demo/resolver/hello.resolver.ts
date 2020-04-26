import { singleton } from "tsyringe";
import { query } from "../../registry/resolver";

@singleton()
export class HelloResolver {
  @query()
  hello(): string {
    return "Hello, world!";
  }
}
