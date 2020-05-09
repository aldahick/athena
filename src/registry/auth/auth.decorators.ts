import { container } from "tsyringe";
import { ControllerPayload } from "../controller";
import { HttpError } from "../../util";
import { AuthRegistry } from "./auth.registry";
import { AuthProviderClass } from "./AuthProvider";
import { BaseAuthContext } from "./BaseAuthContext";
import { AuthCheck } from "./AuthCheck";

export const guard = (check: AuthCheck): MethodDecorator => (target: any, key, descriptor: TypedPropertyDescriptor<any>) => {
  const old: Function = target[key];
  descriptor.value = async function(...args: [any, any, BaseAuthContext] | [ControllerPayload]) {
    let context: BaseAuthContext;
    if (args.length === 1) { // controller
      context = args[0].context;
    } else {
      context = args[2];
    }
    if (!await context.isAuthorized(check)) {
      throw HttpError.unauthorized();
    }
    return old.apply(this, args);
  };
};

export const authProvider = <Provider extends AuthProviderClass>(target: Provider) => {
  const authRegistry = container.resolve(AuthRegistry);
  authRegistry.addProvider(target);
};
