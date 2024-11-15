import {VehicleService} from "./vehicle.service";
import {VehicleFuelService} from "./vehicle.fuel.service";
import {VehicleSnowService} from "./vehicle.snow.service";

export class VehicleModule {
    constructor() {
        new VehicleService()
        new VehicleFuelService()
        new VehicleSnowService()
    }
}