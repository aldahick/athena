import * as express from "express";
import { BaseAuthContext } from "../auth";

export interface ControllerPayload<AuthContext extends BaseAuthContext = BaseAuthContext> {
  req: express.Request;
  res: express.Response;
  context: AuthContext;
}
