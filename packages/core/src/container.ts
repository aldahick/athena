import { injectable, registry } from "tsyringe";
// export { singleton as injectable };
export { container, inject, injectAll, injectable } from "tsyringe";

export const makeRegistryDecorator =
  (token: symbol) => (): ClassDecorator => (target) => {
    const targetConstructor = target as unknown as new () => unknown;
    injectable()(targetConstructor);
    // singleton()(targetConstructor);
    registry([{ token, useClass: targetConstructor }])(targetConstructor);
  };
