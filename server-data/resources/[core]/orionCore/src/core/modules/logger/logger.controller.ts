import { LoggerService } from './logger.service';
import {Inject, Injectable, ServerEvent} from "../../decorators";

@Injectable()
export class LoggerController {
    @Inject(LoggerService)
    private loggerService: LoggerService;

    @ServerEvent('log:info')
    handleInfoLog(message: string, ...args: any[]): void {
        this.loggerService.log(message, ...args);
        console.log(`Log d'info reçu : ${message}`);
    }

    @ServerEvent('log:error')
    handleErrorLog(message: string, ...args: any[]): void {
        this.loggerService.error(message, ...args);
        console.error(`Log d'erreur reçu : ${message}`);
    }

    @ServerEvent('log:warn')
    handleWarnLog(message: string, ...args: any[]): void {
        this.loggerService.warn(message, ...args);
        console.warn(`Log d'avertissement reçu : ${message}`);
    }

    @ServerEvent('log:debug')
    handleDebugLog(message: string, ...args: any[]): void {
        this.loggerService.debug(message, ...args);
        console.debug(`Log de débogage reçu : ${message}`);
    }
}
