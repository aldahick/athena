import { decoratorUtils, HttpMethod } from "../../util";

export const CONTROLLER_METADATA_KEY = "athena.controller";

export interface ControllerMetadata {
  methodName: string;
  httpMethod: HttpMethod;
  route: string;
}

export const controller = (httpMethod: HttpMethod, route: string): MethodDecorator =>
  (target, key): void => {
    const metadatas: ControllerMetadata[] = decoratorUtils.get(CONTROLLER_METADATA_KEY, target) ?? [];
    metadatas.push({
      methodName: key.toString(),
      route,
      httpMethod,
    });
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, metadatas, target);
  };
