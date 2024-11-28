import 'reflect-metadata';
import './globals';
import {WorldClientService} from "./client/world.services";
import {SoundService} from "./client/sound.service";
import {PlayerModule} from "./client/players/player.module";
import {MenuController} from "./client/menu/menu.controller";
import {UtilsController} from "./client/utils/utils.controller";
import {GasStationController} from "./client/gasStation/gasStation.controller";
import {VehicleController} from "./client/vehicles/vehicle.controller";


async function bootstrap() {

    new UtilsController()
    new MenuController()
    new WorldClientService()
    new SoundService()
    new GasStationController()
    new VehicleController()
    new PlayerModule();
}
bootstrap()