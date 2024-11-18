import { Injectable } from "../../../core/decorators";

@Injectable()
export class NotifierService {

    public notify(source: number, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success', delay = 10000): void {
        emitNet('orionCore:client:drawNotification', source, message, type, delay);
    }

    public error(source: number, message: string): void {
        this.notify(source, message, 'error');
    }

    public success(source: number, message: string): void {
        this.notify(source, message, 'success');
    }

    public warning(source: number, message: string): void {
        this.notify(source, message, 'warning');
    }

    public info(source: number, message: string): void {
        this.notify(source, message, 'info');
    }
}
