import * as express from "express";
import { IncomingMessage } from "http";

import { AuthCheck } from "./AuthCheck";

export interface BaseAuthContext {
  req: express.Request | IncomingMessage;
  isAuthorized: (check: AuthCheck) => Promise<boolean>;
}
