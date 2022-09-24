import { container } from "tsyringe";

import { HttpError } from "../../util";
import { ControllerPayload } from "../controller";
import { WebsocketPayload } from "../websocket";
import { AuthRegistry } from "./auth.registry";
import { AuthCheck } from "./AuthCheck";
import { AuthProviderClass } from "./AuthProvider";
import { BaseAuthContext } from "./BaseAuthContext";

type RequestHandler<V> =
  | ((payload: ControllerPayload | WebsocketPayload<unknown>) => V | Promise<V>)
  | ((payload: unknown, args: unknown, context: BaseAuthContext) => V | Promise<V>);

export const guard =
  <V>(check: AuthCheck): MethodDecorator =>
  <T extends RequestHandler<V>>(target: unknown, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
    if (typeof key === "symbol" || !(target instanceof Object) || !target.hasOwnProperty(key)) {
      return;
    }
    const old = descriptor.value as RequestHandler<V>;
    descriptor.value = async function (this: typeof target, payload: ControllerPayload | WebsocketPayload<unknown>, args?: unknown, context?: BaseAuthContext): Promise<V> {
      if (context === undefined) {
        context = (payload as ControllerPayload & WebsocketPayload<unknown>).context;
      }
      if (!(await context.isAuthorized(check))) {
        throw HttpError.unauthorized();
      }
      return old.bind(this)(payload, args, context);
    };
  };

export const authProvider = <Provider extends AuthProviderClass<T>, T>(target: Provider): void => {
  const authRegistry = container.resolve<AuthRegistry<T>>(AuthRegistry);
  authRegistry.addProvider(target);
};
