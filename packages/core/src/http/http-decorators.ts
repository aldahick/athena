import { container, makeRegistryDecorator } from "../container.js";

const CONTROLLER_INFOS_KEY = Symbol("ControllerInfos");
export interface ControllerInfo {
  method: HttpMethod;
  route: string;
  propertyKey: string | symbol;
}

export enum HttpMethod {
  ALL = "all",
  DELETE = "delete",
  GET = "get",
  HEAD = "head",
  OPTIONS = "options",
  PATCH = "patch",
  POST = "post",
  PUT = "put",
}

/**
 * Exported for testing only.
 * @see {@link injectControllers} and {@link controller} to fetch and register controllers, respectively.
 */
export const controllerToken = Symbol("Controller");

/**
 * Registers a class as an Athena controller.
 */
export const controller = makeRegistryDecorator(controllerToken);

export const getControllerInstances = (): object[] =>
  container.isRegistered(controllerToken)
    ? container.resolveAll(controllerToken)
    : [];

export const getControllerInfos = (target: object): ControllerInfo[] =>
  Reflect.getMetadata(CONTROLLER_INFOS_KEY, target) ?? [];

const addControllerInfo = (target: object, info: ControllerInfo): void => {
  const infos = getControllerInfos(target);
  infos.push(info);
  Reflect.defineMetadata(CONTROLLER_INFOS_KEY, infos, target);
};

export const httpRoute =
  (method: HttpMethod, route: string): MethodDecorator =>
  (target, propertyKey, descriptor) => {
    if (typeof descriptor.value !== "function") {
      throw new Error(
        `Cannot use a non-function type as an HTTP controller: ${method} ${route}`,
      );
    }
    addControllerInfo(target, { method, route, propertyKey });
  };

export const get = (route: string): MethodDecorator =>
  httpRoute(HttpMethod.GET, route);
export const post = (route: string): MethodDecorator =>
  httpRoute(HttpMethod.POST, route);
