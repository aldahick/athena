import { query, singleton } from "../..";
import { RedisService } from "../../service/redis";

@singleton()
export class HelloResolver {
  constructor(
    private readonly redis: RedisService
  ) { }

  @query()
  async hello(): Promise<string> {
    await this.redis.emit("hello", "from GraphQL!");
    return "Hello, world!";
  }
}
