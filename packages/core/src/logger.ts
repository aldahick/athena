import { injectable } from "tsyringe";
import winston from "winston";

@injectable()
export class Logger extends winston.Logger {}
