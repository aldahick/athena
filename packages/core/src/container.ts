import { registry, singleton } from "@aldahick/tsyringe";

export { singleton as injectable };
export { container, inject, injectAll } from "@aldahick/tsyringe";

export const makeRegistryDecorator =
  (token: symbol) => (): ClassDecorator => (target) => {
    const constructor = target as unknown as new () => unknown;
    singleton()(constructor);
    registry([{ token, useClass: constructor }])(constructor);
  };
