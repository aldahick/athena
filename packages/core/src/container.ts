import { registry, singleton } from "tsyringe";

export { singleton as injectable };
export { container, inject, injectAll } from "tsyringe";

export const makeRegistryDecorator =
  (token: symbol) => (): ClassDecorator => (target) => {
    const constructor = target as unknown as new () => unknown;
    singleton()(constructor);
    registry([{ token, useClass: constructor }])(constructor);
  };
