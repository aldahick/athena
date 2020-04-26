import * as express from "express";

export interface ControllerPayload {
  req: express.Request;
  res: express.Response;
}
