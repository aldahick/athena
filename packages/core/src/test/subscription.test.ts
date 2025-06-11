import { setTimeout } from "node:timers/promises";
import { Context, SubscribePayload, createClient } from "graphql-ws";
import { describe, expect, it, vi } from "vitest";
import {
  ContextGenerator,
  contextGenerator,
} from "../graphql/graphql-context.js";
import {
  resolveSubscription,
  resolver,
} from "../graphql/graphql-decorators.js";
import { withTestApp } from "../test-util.js";

describe("subscription", () => {
  it("should send GraphQL subscription events", () => {
    const query = "subscription { birthday { id, name } }";
    const context = { context: true };

    @resolver()
    class BirthdayResolver {
      @resolveSubscription("birthday")
      async *birthday(root: never, args: never, actualContext: unknown) {
        expect(actualContext).toEqual(context);
        for (let i = 0; i < 2; i++) {
          yield { birthday: { id: i.toString(), name: `name ${i}` } };
          await setTimeout(50);
        }
      }

      @resolveSubscription()
      personUpdated() {}
    }

    const httpContext = vi.fn();
    const websocketContext = vi
      .fn()
      .mockImplementation(
        (socketContext: Context, payload: SubscribePayload) => {
          expect(socketContext.acknowledged).toEqual(true);
          expect(payload.query).toEqual(query);
          return context;
        },
      );
    @contextGenerator()
    class BirthdayContextGenerator implements ContextGenerator {
      httpContext = httpContext;
      websocketContext = websocketContext;
    }

    return withTestApp(async (baseUrl, config) => {
      const client = createClient({
        url: `ws://localhost:${config.http.port}/graphql`,
      });
      let index = 0;
      for await (const item of client.iterate({ query })) {
        expect(item).toEqual({
          data: { birthday: { id: index.toString(), name: `name ${index}` } },
        });
        index++;
      }
      expect(websocketContext).toHaveBeenCalledOnce();
      expect(httpContext).not.toHaveBeenCalled();
    });
  });
});
