import "reflect-metadata";
import "source-map-support/register";

export * from "./Application";
export * from "./registry/auth";
export * from "./registry/controller";
export * from "./registry/queue";
export * from "./registry/resolver";
export * from "./registry/websocket";
export * from "./service/auth";
export * from "./service/config";
export * from "./service/logger";
export * from "./service/mongo";
export * from "./service/redis";
export * from "./service/typeorm";
export * from "./util";
export * from "./WebServer";
export * as tg from "@typegoose/typegoose";
export { container, singleton } from "tsyringe";
export * as orm from "typeorm";
