import '@citizenfx/client';
import { Injectable, ClientEvent } from '../../core/decorators';

@Injectable()
export class NotifierController {

    @ClientEvent('orionCore:client:drawNotification')
    public handleDrawNotification(message: string, type: 'error' | 'success' | 'warning' | 'info' = 'success', delay: number = 5000): void {
        try {
            let colorCode = 2;

            switch (type) {
                case 'error':
                    colorCode = 6; // Code couleur pour les erreurs
                    break;
                case 'warning':
                    colorCode = 5; // Code couleur pour les avertissements
                    break;
                case 'info':
                    colorCode = 3; // Code couleur pour les informations
                    break;
                case 'success':
                default:
                    colorCode = 2; // Code couleur pour les succès
                    break;
            }

            SetNotificationTextEntry('STRING');
            AddTextComponentSubstringPlayerName(message);
            const notificationHandle = DrawNotification(false, true);
            setTimeout(() => {
                RemoveNotification(notificationHandle);
                console.log(`Notification de type "${type}" supprimée après ${delay} ms : ${message}`);
            }, delay);
        } catch (error) {
            console.error(`Erreur lors de l'affichage de la notification: ${error}`);
        }
    }
}
