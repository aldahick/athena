import * as express from "express";
import { BaseAuthContext } from "../auth";

export interface ControllerPayload {
  req: express.Request;
  res: express.Response;
  context: BaseAuthContext;
}
