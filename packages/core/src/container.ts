import { registry, singleton } from "tsyringe";
export { singleton as injectable };
export { container, inject, injectAll } from "tsyringe";

export const makeRegistryDecorator =
  (token: symbol) => (): ClassDecorator => (target) => {
    const targetConstructor = target as unknown as new () => unknown;
    singleton()(targetConstructor);
    registry([{ token, useClass: targetConstructor }])(targetConstructor);
  };
