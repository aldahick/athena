import { injectable, registry } from "tsyringe";
export { container, inject, injectAll, injectable } from "tsyringe";

export const makeRegistryDecorator =
  (token: symbol) => (): ClassDecorator => (target) => {
    const targetConstructor = target as unknown as new () => unknown;
    injectable()(targetConstructor);
    registry([{ token, useClass: targetConstructor }])(targetConstructor);
  };
