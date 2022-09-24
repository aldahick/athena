import { decoratorUtils } from "../../util";

export const QUEUE_METADATA_KEY = "athena.queue";

export interface QueueMetadata {
  eventName: string;
  methodName: string;
}

export const queueEvent =
  (eventName: string): MethodDecorator =>
  (target, key): void => {
    decoratorUtils.push<QueueMetadata>(
      QUEUE_METADATA_KEY,
      {
        eventName,
        methodName: key.toString()
      },
      target
    );
  };
