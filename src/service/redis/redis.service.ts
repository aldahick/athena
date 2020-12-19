import { EventEmitter } from "events";
import * as Redis from "ioredis";
import { singleton } from "tsyringe";

import { LoggerService } from "../logger";

@singleton()
export class RedisService {
  subClient?: Redis.Redis;

  pubClient?: Redis.Redis;

  private readonly subEmitter = new EventEmitter();

  constructor(
    private readonly logger: LoggerService
  ) { }

  async init(url: string): Promise<void> {
    this.subClient = new Redis(url, {
      lazyConnect: true
    });
    this.pubClient = new Redis(url, {
      lazyConnect: true
    });

    await this.subClient.connect();
    await this.pubClient.connect();

    this.subClient.on("message", this.onMessage);

    const { host } = new URL(url);
    this.logger.info({ host }, "connect.queue.redis");
  }

  close(): void {
    this.subClient?.disconnect();
    this.pubClient?.disconnect();
  }

  async emit<Data>(eventName: string, data: Data): Promise<void> {
    await this.pubClient?.publish(eventName, JSON.stringify(data));
  }

  async on(eventName: string, callback: (data: string) => void): Promise<void> {
    await this.subClient?.subscribe(eventName);
    this.subEmitter.on(eventName, callback);
  }

  private readonly onMessage = (eventName: string, data: string): void => {
    this.subEmitter.emit(eventName, data);
  };
}
