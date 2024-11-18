import { Injectable, Inject } from '../../core/decorators';
import { PlayerService } from '../players/player.service';
import { LoggerService } from "../../core/modules/logger/logger.service";

@Injectable()
export class MenuServices {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(LoggerService)
    private logger: LoggerService;

    public getPlayerMenu(): any {
        const money = this.playerService.getPlayerData()?.money || 0;
        return {
            name: 'Menu Joueur',
            subtitle: 'Options du joueur',
            glare: true,
            closable: true,
            buttons: [
                {
                    name: `Argents: ${money}`,
                    description: 'Affiche l\'argent du joueur',
                },
                {
                    name: "Donner de l'argent",
                    description: "Donner de l'argent à un joueur",
                    onClick: async () => {
                        const amount = await this.openDialogBox('Donner de l\'argent', 'Entrez le montant à donner:', 'number', []);
                        if (amount > 0) {
                            const { closestPlayer } = this.playerService.getClosestPlayer();
                            if (closestPlayer === null) {
                                emit('orionCore:client:notifier:draw', 'error', 'Aucun joueur à proximité');
                                return;
                            }
                            emitNet('orionCore:server:money:send', closestPlayer, amount);
                        }
                    }
                },
                {
                    name: 'Voir Inventaire',
                    description: 'Affiche l\'inventaire du joueur',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Inventaire ouvert !'] });
                    }
                },
                {
                    name: 'Statistiques',
                    description: 'Voir les statistiques du joueur',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Statistiques affichées !'] });
                    }
                }
            ]
        };
    }

    public getVehicleMenu(): any {
        return {
            name: 'Menu Véhicule',
            subtitle: 'Options du véhicule',
            glare: true,
            closable: true,
            buttons: [
                {
                    name: 'Allumer/Éteindre Moteur',
                    description: 'Allume ou éteint le moteur du véhicule',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Moteur allumé/éteint !'] });
                    }
                },
                {
                    name: 'Ouvrir/fermer Portières',
                    description: 'Contrôle l\'ouverture des portières',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Portières contrôlées !'] });
                    }
                }
            ]
        };
    }

    public getJobMenu(): any {
        return {
            name: 'Menu Jobs',
            subtitle: 'Options de travail',
            glare: true,
            closable: true,
            buttons: [
                {
                    name: 'Commencer Job',
                    description: 'Démarrer un job sélectionné',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Job démarré !'] });
                    }
                },
                {
                    name: 'Fin de Service',
                    description: 'Termine le service actuel',
                    onClick: () => {
                        emit('chat:addMessage', { args: ['Système', 'Service terminé !'] });
                    }
                }
            ]
        };
    }

    private async openDialogBox(title: string, message: string, type: 'text' | 'number', buttons: any): Promise<unknown> {
        return new Promise((resolve) => {
            let maxInputLength = type === 'text' ? 256 : 20;

            AddTextEntry("FMMC_MPM_NA", title);
            DisplayOnscreenKeyboard(1, "FMMC_MPM_NA", message, "", "", "", "", maxInputLength);

            // Boucle pour attendre la saisie de l'utilisateur
            const interval = setInterval(() => {
                const status = UpdateOnscreenKeyboard();

                if (status === 1) { // L'utilisateur a terminé la saisie
                    let result = GetOnscreenKeyboardResult();
                    clearInterval(interval);

                    if (type === 'number') {
                        const parsedResult = Number(result);
                        if (!isNaN(parsedResult) && isFinite(parsedResult)) {
                            resolve(parsedResult); // Résultat sous forme de `number`
                        } else {
                            this.logger.log(`Erreur : la saisie n'est pas un nombre valide.`);
                            resolve(null);
                        }
                    } else {
                        resolve(result);
                    }
                } else if (status === 2) {
                    clearInterval(interval);
                    resolve(null);
                }
                DisableAllControlActions(0);
            }, 0);
        });
    }

}
