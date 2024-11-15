import {Delay} from "../../utils/fivem";
import {Injectable} from "../../core/decorators";

@Injectable()
export class VehicleService {
    private seatbeltOn: boolean = false;
    private lastVelocity: number = 0;
    private ejectionThreshold: number = 45.0;
    private wasInVehicle: boolean = false;

    initialize() {
        console.log('VehicleService initialized.');
        this.monitorSeatbelt();
        this.monitorSpeedAndCollisions();
    }

    public toggleSeatbelt() {
        this.seatbeltOn = !this.seatbeltOn;
        const message = this.seatbeltOn ? 'Ceinture attachée.' : 'Ceinture détachée.';
        emitNet('chat:addMessage', { args: ["Système", message] });
    }

    private async monitorSeatbelt() {
        setTick(async () => {
            const playerPed = PlayerPedId();
            const isInVehicle = IsPedInAnyVehicle(playerPed, false);

            if (isInVehicle) {
                if (IsControlJustPressed(0, 29)) {
                    this.toggleSeatbelt();
                }
                SetFollowVehicleCamViewMode(4);
                this.wasInVehicle = true;
            } else if (this.wasInVehicle) {
                SetFollowPedCamViewMode(1);
                this.wasInVehicle = false;
            }
            await Delay(30);
        });
    }

    private async monitorSpeedAndCollisions() {
        setTick(async () => {
            const playerPed = PlayerPedId();
            const vehicle = GetVehiclePedIsIn(playerPed, false);

            if (vehicle) {
                const velocity = GetEntitySpeedVector(vehicle, true);
                const currentSpeed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);

                if (!this.seatbeltOn && this.lastVelocity - currentSpeed > this.ejectionThreshold) {
                    TaskLeaveVehicle(playerPed, vehicle, 4160);
                    SetPedToRagdoll(playerPed, 5000, 5000, 0, false, false, false);
                    emitNet('chat:addMessage', { args: ["Système", "Vous avez été éjecté !"] });
                }

                this.lastVelocity = currentSpeed;
            } else {
                this.lastVelocity = 0;
            }

            await Delay(100);
        });
    }
}
