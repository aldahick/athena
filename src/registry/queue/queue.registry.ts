import { container, InjectionToken, singleton } from "tsyringe";

import { LoggerService } from "../../service/logger";
import { RedisService } from "../../service/redis";
import { decoratorUtils } from "../../util";
import { QUEUE_METADATA_KEY, QueueMetadata } from "./queue.decorators";
import { QueuePayload } from "./QueuePayload";

type EventHandler = (payload: QueuePayload<unknown>) => Promise<unknown>;

@singleton()
export class QueueRegistry {
  constructor(
    private readonly logger: LoggerService,
    private readonly redis: RedisService
  ) { }

  async register(eventHandlerClasses: unknown[]): Promise<void> {
    const eventHandlers = eventHandlerClasses.map(c =>
      container.resolve<unknown>(c as InjectionToken)
    ) as Record<string, unknown>[];
    for (const eventHandler of eventHandlers) {
      const metadatas = decoratorUtils.get<QueueMetadata[]>(QUEUE_METADATA_KEY, eventHandler) ?? [];
      for (const { eventName, methodName } of metadatas) {
        if (typeof eventHandler !== "object") {
          return;
        }
        const callback = eventHandler[methodName];
        if (typeof callback !== "function") {
          continue;
        }
        await this.redis.on(eventName, this.onMessage(eventName, callback.bind(eventHandler)));
        this.logger.trace({
          eventName,
          methodName,
          className: eventHandler.constructor.name
        }, "register.queueEvent");
      }
    }
  }

  private readonly onMessage = (eventName: string, callback: EventHandler) =>
    (message: string): void => {
      const payload: QueuePayload<unknown> = {
        data: JSON.parse(message) as unknown
      };
      const result = callback(payload);
      if (result instanceof Promise) {
        result.catch(err => {
          this.logger.error(err, { eventName, payload }, "queue.uncaught");
        });
      }
    };
}
