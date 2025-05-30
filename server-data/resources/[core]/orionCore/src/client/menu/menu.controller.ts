import {ClientEvent, Command, Inject, Injectable, KeyMapping} from "../../core/decorators";
import {LoggerService} from "../../core/modules/logger/logger.service";
import {MenuServices} from "./menu.services";

@Injectable()
export class MenuController {
    @Inject(MenuServices)
    private menuService: MenuServices;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Command({ name: 'openPlayerMenu', description: 'Ouvrir le menu du joueur', role: null })
    @KeyMapping('openPlayerMenu', 'Ouvre le menu du joueur', 'keyboard', 'F1')
    openPlayerMenu() {
        this.menuService.openPlayerMenu();
    }

    @Command({ name: 'openInventoryMenu', description: 'Ouvrir le menu du joueur', role: null })
    @KeyMapping('openInventoryMenu', 'Ouvre l inventaire du joueur', 'keyboard', 'I')
    openInventoryMenu() {
        this.menuService.openInventoryMenu();
    }

    @Command({ name: 'openVehicleMenu', description: 'Ouvrir le menu du véhicule', role: null })
    @KeyMapping('openVehicleMenu', 'Ouvre le menu du véhicule', 'keyboard', 'F2')
    openVehicleMenu() {
        this.menuService.openVehicleMenu();
    }

    @Command({ name: 'openJobMenu', description: 'Ouvrir le menu des jobs', role: null })
    openJobMenu() {
        this.menuService.openJobMenu();
    }

    @ClientEvent('menu:close')
    closeMenu() {
        this.menuService.closeMenu();
    }
}
