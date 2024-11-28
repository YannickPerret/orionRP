import { Injectable, Inject } from '../../core/decorators';
import { PlayerService } from '../players/player.service';
import { LoggerService } from "../../core/modules/logger/logger.service";
import {VehicleService} from "../vehicles/vehicle.service";

@Injectable()
export class MenuServices {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    private currentMenu: any = null;

    public openMenu(menu: any) {
        if (this.currentMenu) {
            this.closeMenu();
        }
        this.currentMenu = menu;
        exports['menu'].CreateMenu(menu);
        this.logger.log(`Menu ouvert : ${menu.name}`);
    }

    public closeMenu() {
        if (this.currentMenu) {
            exports['menu'].CloseMenu();
            this.logger.log(`Menu fermé : ${this.currentMenu.name}`);
            this.currentMenu = null;
        }
    }

    public openSubmenu(submenuKey: string) {
        if (this.currentMenu && this.currentMenu.submenus?.[submenuKey]) {
            console.log(this.currentMenu.submenus)
            exports['menu'].CreateSubmenu(this.currentMenu.submenus[submenuKey]);
            this.logger.log(`Sous-menu ouvert : ${submenuKey}`);
        } else {
            this.logger.error(`Sous-menu introuvable : ${submenuKey}`);
        }
    }

    public openPlayerMenu(): any {
        const money = this.playerService.getPlayer().character.money.money
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
                        const amount = await this.openDialogBox('Donner de l\'argent', 'Entrez le montant à donner:', 'number');
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

    public openInventoryMenu(): any {
        const inventory = this.playerService.getPlayerData()?.inventory || [];
        return {
            name : 'Menu Inventaire',
            subtitle : 'Contenu de l\'inventaire',
            glare : true,
            closable : true,
            buttons: [
                inventory.map((item: any) => {
                    return {
                        name: item.name,
                        description: item.description,
                        onClick: () => {
                            emit('orionCore:server:inventory:use', item.id);
                        }
                    }
                })
            ]
        }
    }

    public openVehicleMenu() {
        const playerPed = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(playerPed, false);

        if (vehicle && GetPedInVehicleSeat(vehicle, -1) === playerPed) {
            const vehicleMenu = {
                name: 'Menu Véhicule',
                subtitle: 'Options du véhicule',
                glare: true,
                closable: true,
                buttons: [
                    {
                        name: 'Allumer/Éteindre Moteur',
                        description: 'Allume ou éteint le moteur du véhicule',
                        onClick: () => {
                            const engineStatus = GetIsVehicleEngineRunning(vehicle);
                            SetVehicleEngineOn(vehicle, !engineStatus, false, true);
                        }
                    },
                    {
                        name: 'Menu Portières',
                        onClick: () => { this.openSubmenu('vehicleDoorsMenu'); }
                    },
                    {
                        name: 'Menu Limitateur',
                        onClick: () => { this.openSubmenu('vehicleLimitsMenu'); }
                    },
                    {
                        name: 'Fermer le menu',
                        onClick: () => this.closeMenu(),
                    }
                ],
                submenus: {
                    'vehicleDoorsMenu': this.getVehicleDoorsMenu(vehicle),
                    'vehicleLimitsMenu': this.getVehicleLimitsMenu(vehicle)
                }
            };

            this.openMenu(vehicleMenu);
        } else {
            if (this.currentMenu === 'vehicleMenu')
             this.closeMenu();
        }
    }

    private getVehicleDoorsMenu(vehicle: number): any {
        return {
            name: 'Menu Portières',
            subtitle: 'Options des portières',
            glare: true,
            buttons: [
                {
                    name: 'Ouvrir/Fermer toutes les portières',
                    onClick: () => {
                        for (let i = 0; i < 6; i++) {
                            if (GetVehicleDoorAngleRatio(vehicle, i) > 0) {
                                SetVehicleDoorShut(vehicle, i, false);
                            } else {
                                SetVehicleDoorOpen(vehicle, i, false, false);
                            }
                        }
                    }
                },
                {
                    name: 'Retour',
                    onClick: () => { this.openMenu(this.currentMenu); }
                }
            ]
        };
    }

    private getVehicleLimitsMenu(vehicle: number): any {
        return {
            name: 'Limitateur de vitesse',
            subtitle: 'Options du limitateur de vitesse',
            glare: true,
            buttons: [
                {
                    name: 'Activer/Désactiver Limitateur',
                    onClick: () => {
                        this.vehicleService.toggleLimiterEnabled(true);
                    }
                },
                {
                    name: 'Régler la vitesse manuellement',
                    onClick: async () => {
                        const speed = await this.openDialogBox('Régler la vitesse', 'Entrez la vitesse à régler:', 'number');
                        if (speed && speed > 0) {
                            this.vehicleService.setMaxSpeed(vehicle, Number(speed));
                        }
                    }
                },
                {
                    name: 'Retour',
                    onClick: () => { this.openMenu(this.currentMenu); }
                }
            ]
        };
    }

    public openJobMenu(): any {
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

    private async openDialogBox(title: string, message: string, type: 'text' | 'number'): Promise<unknown> {
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
