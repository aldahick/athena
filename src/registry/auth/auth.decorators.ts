import { container } from "tsyringe";

import { HttpError } from "../../util";
import { ControllerPayload } from "../controller";
import { WebsocketPayload } from "../websocket";
import { AuthRegistry } from "./auth.registry";
import { AuthCheck } from "./AuthCheck";
import { AuthProviderClass } from "./AuthProvider";
import { BaseAuthContext } from "./BaseAuthContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const guard = (check: AuthCheck): MethodDecorator => (target, key, descriptor: TypedPropertyDescriptor<any>): void => {
  if (typeof target !== "object" || !(key in target)) {
    return;
  }
  const old = (target as {[key: string]: (...args: unknown[]) => unknown})[key as string];
  descriptor.value = async function(...[payload, args, context]: [
    unknown,
    unknown,
    BaseAuthContext
  ] | [
    ControllerPayload | WebsocketPayload<unknown>
  ]): Promise<unknown> {
    if (context === undefined) {
      context = (payload as ControllerPayload & WebsocketPayload<unknown>).context;
    }
    if (!await context.isAuthorized(check)) {
      throw HttpError.unauthorized();
    }
    return old.apply(this, [payload, args, context]);
  };
};

export const authProvider = <Provider extends AuthProviderClass>(target: Provider): void => {
  const authRegistry = container.resolve(AuthRegistry);
  authRegistry.addProvider(target);
};
