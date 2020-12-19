import * as express from "express";

import { AuthCheck } from "./AuthCheck";

export interface BaseAuthContext {
  req: express.Request;
  isAuthorized: (check: AuthCheck) => Promise<boolean>;
}
