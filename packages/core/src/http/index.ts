import "@fastify/multipart";

export type {
  FastifyReply as HttpResponse,
  FastifyRequest as HttpRequest,
} from "fastify";
export * from "./http-decorators.js";
export * from "./http-server.js";
