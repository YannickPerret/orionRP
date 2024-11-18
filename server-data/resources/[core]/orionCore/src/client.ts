import 'reflect-metadata';
import './globals';
import {WorldClientService} from "./client/world.services";
import {SoundService} from "./client/sound.service";
import {PlayerModule} from "./client/players/player.module";
import {VehicleModule} from "./client/vehicles/vehicle.module";
import {GasStationModule} from "./client/gasStation/gasStation.module";
import {MenuController} from "./client/menu/menu.controller";


async function bootstrap() {

    new MenuController()
    new WorldClientService()
    new SoundService()
    new GasStationModule()
    new VehicleModule()
    new PlayerModule();
}
bootstrap()