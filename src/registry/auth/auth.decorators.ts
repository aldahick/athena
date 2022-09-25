import { container } from "tsyringe";

import { HttpError } from "../../util";
import { ControllerPayload } from "../controller";
import { WebsocketPayload } from "../websocket";
import { AuthRegistry } from "./auth.registry";
import { AuthCheck } from "./AuthCheck";
import { AuthProviderClass } from "./AuthProvider";

type RequestHandler<V> = ((payload: ControllerPayload | WebsocketPayload<unknown>) => V | Promise<V>);

export const guard =
  <V>(check: AuthCheck): MethodDecorator =>
  (<T extends RequestHandler<V>>(target: unknown, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
    if (typeof key === "symbol" || !(target instanceof Object) || !target.hasOwnProperty(key)) {
      return;
    }
    const old = descriptor.value;
    if (old === undefined || typeof old !== "function") {
      throw new Error(`missing PropertyDescriptor value for ${target.constructor.name}.${key}`);
    }
    descriptor.value = async function (this: typeof target, payload: ControllerPayload | WebsocketPayload<unknown>): Promise<V> {
      if (!(await payload.context.isAuthorized(check))) {
        throw HttpError.unauthorized();
      }
      return old.call(this, payload);
    } as T;
  }) as MethodDecorator;

export const authProvider = <Provider extends AuthProviderClass<T>, T>() => (target: Provider): void => {
  const authRegistry = container.resolve<AuthRegistry<T>>(AuthRegistry);
  authRegistry.addProvider(target);
};
