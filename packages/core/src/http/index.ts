import "@fastify/multipart";

export * from "./http-decorators.js";
export * from "./http-server.js";
export type {
  FastifyRequest as HttpRequest,
  FastifyReply as HttpResponse,
} from "fastify";
