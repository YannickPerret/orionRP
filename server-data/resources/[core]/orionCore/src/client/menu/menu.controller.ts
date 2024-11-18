import {Injectable, Command, Inject, ClientEvent, KeyMapping} from '../../core/decorators';
import { LoggerService } from "../../core/modules/logger/logger.service";
import {MenuServices} from "./menu.services";

@Injectable()
export class MenuController {
    @Inject(MenuServices)
    private menuService: MenuServices;

    @Inject(LoggerService)
    private logger: LoggerService;

    private currentMenu: any = null;

    private openSingleMenu(menu: any) {
        if (this.currentMenu) {
            this.currentMenu = null;
            exports['menu'].CloseMenu();
            this.logger.log(`Fermeture du menu actuel: ${this.currentMenu.name}`);
        }
        this.currentMenu = menu;
        exports['menu'].CreateMenu(menu);
    }

    @Command({ name: 'openPlayerMenu', description: 'Ouvrir le menu du joueur', role: null })
    @KeyMapping('openPlayerMenu', 'Ouvre le menu du joueur', 'keyboard', 'F1')
    openPlayerMenu() {
        const playerMenu = this.menuService.getPlayerMenu();
        this.openSingleMenu(playerMenu);
    }

    @Command({ name: 'openVehicleMenu', description: 'Ouvrir le menu du véhicule', role: null })
    openVehicleMenu() {
        const vehicleMenu = this.menuService.getVehicleMenu();
        this.openSingleMenu(vehicleMenu);
    }

    @Command({ name: 'openJobMenu', description: 'Ouvrir le menu des jobs', role: null })
    openJobMenu() {
        const jobMenu = this.menuService.getJobMenu();
        this.openSingleMenu(jobMenu);
    }

    @ClientEvent('menu:close')
    closeMenu() {
        this.currentMenu = null;
        exports['menu'].CloseMenu();
    }
}
