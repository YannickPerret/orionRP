// src/client/menu/menu.services.ts
import { Injectable, Inject } from '../../core/decorators';
import { PlayerService } from '../players/player.service';
import { LoggerService } from "../../core/modules/logger/logger.service";
import { VehicleService } from "../vehicles/vehicle.service";

// Import des nouveaux services
import { CacheService } from "../../core/modules/cache/cache.service";
import { ConfigService } from "../../core/modules/config/config.service";
import { ValidationService } from "../../core/modules/validation/validation.service";
import { ErrorHandler, HandleErrors } from "../../core/modules/error/error.handler";
import { Cacheable } from "../../core/modules/cache/cache.service";
import { Validate } from "../../core/modules/validation/validation.service";

@Injectable()
export class MenuServices {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(CacheService)
    private cache: CacheService;

    @Inject(ConfigService)
    private config: ConfigService;

    @Inject(ValidationService)
    private validation: ValidationService;

    @Inject(ErrorHandler)
    private errorHandler: ErrorHandler;

    private currentMenu: any = null;

    @HandleErrors()
    public openMenu(menu: any) {
        if (this.currentMenu) {
            this.closeMenu();
        }
        this.currentMenu = menu;
        exports['menu'].CreateMenu(menu);
        this.logger.log(`Menu opened: ${menu.name}`);
    }

    @HandleErrors()
    public closeMenu() {
        if (this.currentMenu) {
            exports['menu'].CloseMenu();
            this.logger.log(`Menu closed: ${this.currentMenu.name}`);
            this.currentMenu = null;
        }
    }

    @HandleErrors()
    public openSubmenu(submenuKey: string) {
        if (this.currentMenu && this.currentMenu.submenus?.[submenuKey]) {
            exports['menu'].CreateSubmenu(this.currentMenu.submenus[submenuKey]);
            this.logger.log(`Submenu opened: ${submenuKey}`);
        } else {
            this.logger.error(`Submenu not found: ${submenuKey}`);
        }
    }

    /**
     * Menu du joueur avec cache et validation
     */
    @HandleErrors()
    @Cacheable(() => 'player_menu_data', 30000) // 30 secondes
    public async openPlayerMenu(): Promise<any> {
        const player = this.playerService.getPlayer();
        if (!player?.character) {
            throw new Error('No player character data available');
        }

        const money = player.character.money.money;

        return {
            name: 'Menu Joueur',
            subtitle: 'Options du joueur',
            glare: true,
            closable: true,
            buttons: [
                {
                    name: `Argent: ${money.toLocaleString()}€`,
                    description: 'Affiche l\'argent du joueur',
                },
                {
                    name: "Donner de l'argent",
                    description: "Donner de l'argent à un joueur",
                    onClick: async () => {
                        try {
                            const amount = await this.openValidatedDialogBox(
                                'Donner de l\'argent',
                                'Entrez le montant à donner:',
                                'number',
                                {
                                    min: 1,
                                    max: money,
                                    message: `Montant doit être entre 1 et ${money}`
                                }
                            );

                            if (amount && amount > 0) {
                                const { closestPlayer } = this.playerService.getClosestPlayer();
                                if (closestPlayer === null) {
                                    emit('orionCore:client:notifier:draw', 'error', 'Aucun joueur à proximité');
                                    return;
                                }
                                emitNet('orionCore:server:money:send', closestPlayer, amount);
                            }
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'giveMoney' });
                            emit('orionCore:client:notifier:draw', 'error', 'Erreur lors du transfert d\'argent');
                        }
                    }
                },
                {
                    name: 'Voir Inventaire',
                    description: 'Affiche l\'inventaire du joueur',
                    onClick: () => {
                        this.openInventoryMenu();
                    }
                },
                {
                    name: 'Statistiques',
                    description: 'Voir les statistiques du joueur',
                    onClick: async () => {
                        try {
                            const stats = await this.getPlayerStats();
                            this.displayPlayerStats(stats);
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'getPlayerStats' });
                            emit('orionCore:client:notifier:draw', 'error', 'Erreur lors du chargement des statistiques');
                        }
                    }
                }
            ]
        };
    }

    /**
     * Menu inventaire avec cache
     */
    @HandleErrors()
    @Cacheable(() => {
        const player = this.playerService.getPlayer();
        return `inventory_menu_${player?.character?.citizenid}`;
    }, 60000) // 1 minute
    public async openInventoryMenu(): Promise<any> {
        const playerData = this.playerService.getPlayerData();
        const inventory = playerData?.inventory || [];

        return {
            name: 'Menu Inventaire',
            subtitle: 'Contenu de l\'inventaire',
            glare: true,
            closable: true,
            buttons: inventory.map((item: any) => ({
                name: item.name,
                description: item.description,
                onClick: () => {
                    this.useItem(item.id);
                }
            }))
        };
    }

    /**
     * Menu véhicule avec validation d'état
     */
    @HandleErrors()
    public openVehicleMenu() {
        const playerPed = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(playerPed, false);

        if (!vehicle || GetPedInVehicleSeat(vehicle, -1) !== playerPed) {
            if (this.currentMenu?.name === 'Menu Véhicule') {
                this.closeMenu();
            }
            return;
        }

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
                        try {
                            const engineStatus = GetIsVehicleEngineRunning(vehicle);
                            SetVehicleEngineOn(vehicle, !engineStatus, false, true);

                            const status = !engineStatus ? 'allumé' : 'éteint';
                            emit('orionCore:client:notifier:draw', 'success', `Moteur ${status}`);
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'toggleEngine' });
                            emit('orionCore:client:notifier:draw', 'error', 'Erreur avec le moteur');
                        }
                    }
                },
                {
                    name: 'Menu Portières',
                    onClick: () => {
                        this.openSubmenu('vehicleDoorsMenu');
                    }
                },
                {
                    name: 'Menu Limitateur',
                    onClick: () => {
                        this.openSubmenu('vehicleLimitsMenu');
                    }
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
    }

    @HandleErrors()
    private getVehicleDoorsMenu(vehicle: number): any {
        return {
            name: 'Menu Portières',
            subtitle: 'Options des portières',
            glare: true,
            buttons: [
                {
                    name: 'Ouvrir/Fermer toutes les portières',
                    onClick: () => {
                        try {
                            for (let i = 0; i < 6; i++) {
                                if (GetVehicleDoorAngleRatio(vehicle, i) > 0) {
                                    SetVehicleDoorShut(vehicle, i, false);
                                } else {
                                    SetVehicleDoorOpen(vehicle, i, false, false);
                                }
                            }
                            emit('orionCore:client:notifier:draw', 'success', 'Portières basculées');
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'toggleDoors' });
                            emit('orionCore:client:notifier:draw', 'error', 'Erreur avec les portières');
                        }
                    }
                },
                {
                    name: 'Retour',
                    onClick: () => { this.openVehicleMenu(); }
                }
            ]
        };
    }

    @HandleErrors()
    private getVehicleLimitsMenu(vehicle: number): any {
        return {
            name: 'Limitateur de vitesse',
            subtitle: 'Options du limitateur de vitesse',
            glare: true,
            buttons: [
                {
                    name: 'Activer/Désactiver Limitateur',
                    onClick: () => {
                        try {
                            this.vehicleService.toggleLimiterEnabled = !this.vehicleService.toggleLimiterEnabled;
                            const status = this.vehicleService.toggleLimiterEnabled ? 'activé' : 'désactivé';
                            emit('orionCore:client:notifier:draw', 'success', `Limitateur ${status}`);
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'toggleSpeedLimiter' });
                        }
                    }
                },
                {
                    name: 'Régler la vitesse manuellement',
                    onClick: async () => {
                        try {
                            const speed = await this.openValidatedDialogBox(
                                'Régler la vitesse',
                                'Entrez la vitesse à régler (km/h):',
                                'number',
                                {
                                    min: 10,
                                    max: 200,
                                    message: 'Vitesse doit être entre 10 et 200 km/h'
                                }
                            );

                            if (speed && speed > 0) {
                                this.vehicleService.setMaxSpeed(vehicle, speed);
                                emit('orionCore:client:notifier:draw', 'success', `Vitesse limitée à ${speed} km/h`);
                            }
                        } catch (error) {
                            this.errorHandler.handle(error, { action: 'setSpeedLimit' });
                            emit('orionCore:client:notifier:draw', 'error', 'Erreur lors du réglage');
                        }
                    }
                },
                {
                    name: 'Retour',
                    onClick: () => { this.openVehicleMenu(); }
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

    /**
     * Dialog box avec validation automatique
     */
    @HandleErrors()
    private async openValidatedDialogBox(
        title: string,
        message: string,
        type: 'text' | 'number',
        validation?: {
            min?: number;
            max?: number;
            message?: string;
        }
    ): Promise<unknown> {
        return new Promise((resolve, reject) => {
            let maxInputLength = type === 'text' ? 256 : 20;

            AddTextEntry("FMMC_MPM_NA", title);
            DisplayOnscreenKeyboard(1, "FMMC_MPM_NA", message, "", "", "", "", maxInputLength);

            const interval = setInterval(() => {
                const status = UpdateOnscreenKeyboard();

                if (status === 1) { // L'utilisateur a terminé la saisie
                    let result = GetOnscreenKeyboardResult();
                    clearInterval(interval);

                    if (type === 'number') {
                        const parsedResult = Number(result);
                        if (!isNaN(parsedResult) && isFinite(parsedResult)) {
                            // Validation des limites
                            if (validation) {
                                if (validation.min !== undefined && parsedResult < validation.min) {
                                    emit('orionCore:client:notifier:draw', 'error', validation.message || `Minimum: ${validation.min}`);
                                    reject(new Error('Validation failed: below minimum'));
                                    return;
                                }
                                if (validation.max !== undefined && parsedResult > validation.max) {
                                    emit('orionCore:client:notifier:draw', 'error', validation.message || `Maximum: ${validation.max}`);
                                    reject(new Error('Validation failed: above maximum'));
                                    return;
                                }
                            }
                            resolve(parsedResult);
                        } else {
                            this.logger.log(`Error: input is not a valid number.`);
                            emit('orionCore:client:notifier:draw', 'error', 'Nombre invalide');
                            reject(new Error('Invalid number'));
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

    /**
     * Utilisation d'item avec cache d'invalidation
     */
    @HandleErrors()
    private async useItem(itemId: string): Promise<void> {
        try {
            emitNet('orionCore:server:inventory:use', itemId);

            // Invalider le cache de l'inventaire
            const player = this.playerService.getPlayer();
            if (player?.character?.citizenid) {
                this.cache.delete(`inventory_menu_${player.character.citizenid}`);
            }

            emit('orionCore:client:notifier:draw', 'success', 'Item utilisé');
        } catch (error) {
            this.errorHandler.handle(error, { action: 'useItem', itemId });
            emit('orionCore:client:notifier:draw', 'error', 'Erreur lors de l\'utilisation');
        }
    }

    /**
     * Statistiques du joueur avec cache
     */
    @Cacheable(() => {
        const player = this.playerService.getPlayer();
        return `player_stats_${player?.character?.citizenid}`;
    }, 120000) // 2 minutes
    private async getPlayerStats(): Promise<any> {
        const player = this.playerService.getPlayer();
        if (!player?.character) {
            throw new Error('No player data available');
        }

        return {
            money: player.character.money.money,
            bank: player.character.bank,
            health: player.character.health,
            armor: player.character.armor,
            hunger: player.character.hunger,
            thirst: player.character.thirst,
            playTime: this.calculatePlayTime()
        };
    }

    /**
     * Affichage des statistiques
     */
    private displayPlayerStats(stats: any): void {
        const message = `
        💰 Argent: ${stats.money}€
        🏦 Banque: ${stats.bank}€
        ❤️ Santé: ${Math.round(stats.health)}%
        🛡️ Armure: ${Math.round(stats.armor)}%
        🍔 Faim: ${Math.round(stats.hunger)}%
        💧 Soif: ${Math.round(stats.thirst)}%
        ⏰ Temps de jeu: ${stats.playTime}
        `;

        emit('chat:addMessage', {
            args: ['Statistiques', message]
        });
    }

    /**
     * Calcul du temps de jeu (placeholder)
     */
    private calculatePlayTime(): string {
        // Implémentation basique - à améliorer selon vos besoins
        return "2h 34min";
    }
}