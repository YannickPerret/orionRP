import pino from 'pino';
import {Injectable} from "../../decorators";
import {IS_PRODUCTION} from "../../../globals";

@Injectable()
export class LoggerService {
    private logger;

    constructor() {
        this.logger = pino({
            level: process.env.LOG_LEVEL || 'info',
            prettyPrint: !IS_PRODUCTION ? { colorize: true } : false,
        });
    }

    public log(message: string, ...args: any[]): void {
        this.logger.info(message, ...args);
    }

    public error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args);
    }

    public debug(message: string, ...args: any[]): void {
        this.logger.debug(message, ...args);
    }
}
