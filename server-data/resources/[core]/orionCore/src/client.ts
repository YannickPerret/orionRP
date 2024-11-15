import 'reflect-metadata';
import './globals';
import {WorldClientService} from "./client/world.services";
import {SoundService} from "./client/sound.service";
import {PlayerModule} from "./client/players/player.module";
import {VehicleModule} from "./client/vehicles/vehicle.module";
import {GasStationModule} from "./client/gasStation/gasStation.module";


async function bootstrap() {

    new WorldClientService()
    new SoundService()
    new GasStationModule()
    new VehicleModule()
    new PlayerModule();
}
bootstrap()