import { injectable } from "inversify";
import winston from "winston";

@injectable()
export class Logger extends winston.Logger {}
