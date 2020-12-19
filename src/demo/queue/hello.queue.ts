import { singleton } from "tsyringe";

import { queueEvent, QueuePayload } from "../..";
import { LoggerService } from "../../service/logger";

@singleton()
export class HelloQueueHandler {
  constructor(
    private readonly logger: LoggerService
  ) { }

  @queueEvent("hello")
  hello({ data }: QueuePayload<string>): void {
    this.logger.trace(data, "queue.hello");
  }

  @queueEvent("hello")
  hello2({ data }: QueuePayload<string>): void {
    this.logger.trace(data, "queue.hello2");
  }
}
