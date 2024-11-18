import { Injectable, ServerEvent, Inject } from "../../../core/decorators";
import { NotifierService } from "./notifier.service";

@Injectable()
export class NotifierController {
    @Inject(NotifierService)
    private notifierService: NotifierService;

    @ServerEvent('notify:send')
    public handleSendNotification(source: number, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success', delay = 10000): void {
        try {
            this.notifierService.notify(source, message, type, delay);
            console.log(`Notification envoyée à la source ${source}: ${message} (type: ${type})`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de la notification: ${error}`);
        }
    }
}
