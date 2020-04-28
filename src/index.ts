import "reflect-metadata";
import "source-map-support/register";

export { container, singleton } from "tsyringe";

export * from "./registry/controller";
export * from "./registry/resolver";

export * from "./service/config";
export * from "./service/logger";
export * from "./service/mongo";
export * from "./service/typeorm";

export * from "./util";

export * from "./Application";
export * from "./WebServer";
