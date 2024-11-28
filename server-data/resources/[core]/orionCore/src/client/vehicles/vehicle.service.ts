import {Delay} from "../../utils/fivem";
import {Injectable} from "../../core/decorators";

@Injectable()
export class VehicleService {
    private seatbeltOn: boolean = false;
    private lastVelocity: number = 0;
    private ejectionThreshold: number = 45.0;
    private wasInVehicle: boolean = false;

    private speedLimiterEnabled: boolean = false;
    private speedLimit: number = 50;

    initialize() {
        console.log('VehicleService initialized.');
        this.monitorSeatbelt();
        this.monitorSpeedAndCollisions();
    }

    /* SETTER AN GETTER */
    set speedLimiter(value: number) {
        this.speedLimit = value;
    }

    get speedLimiter() {
        return this.speedLimit;
    }

    set toggleLimiterEnabled(value: boolean) {
        this.speedLimiterEnabled = value;
    }

    get toggleLimiterEnabled() {
        return this.speedLimiterEnabled;
    }

    /* METHODS */

    setMaxSpeed(vehicle: number, speed: number) {
        if (!DoesEntityExist(vehicle)) {
            return;
        }
        if (IsPedInAnyVehicle(PlayerPedId(), false))
            SetEntityMaxSpeed(vehicle, speed);
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

                if (!velocity || !Array.isArray(velocity)) {
                    console.error('Invalid velocity:', velocity);
                    return;
                }

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
            await Delay(50);
        });
    }

    /* not used */
    async spawnVehicle(
        model: string,
        x: number,
        y: number,
        z: number,
        heading: number,
        isNetworked: boolean = true,
        pedIsInside: boolean = true,
        cb?: (vehicle: number | null, error?: string) => void
    ) {
        try {
            const modelHash = GetHashKey(model);
            RequestModel(modelHash);

            while (!HasModelLoaded(modelHash)) {
                await Delay(100);
            }

            const vehicle = CreateVehicle(modelHash, x, y, z, heading, isNetworked, false);

            if (!DoesEntityExist(vehicle)) {
                if (cb) cb(null, `Échec de la création du véhicule : ${model}`);
                return;
            }

            SetVehicleHasBeenOwnedByPlayer(vehicle, true);
            SetNetworkIdCanMigrate(NetworkGetNetworkIdFromEntity(vehicle), true);
            SetVehicleNeedsToBeHotwired(vehicle, false);
            SetVehRadioStation(vehicle, 'OFF');
            SetVehicleFuelLevel(vehicle, 50.0);
            SetModelAsNoLongerNeeded(modelHash);
            SetVehicleNumberPlateText(vehicle, VehicleService.generatePlate());
            if (pedIsInside) TaskWarpPedIntoVehicle(PlayerPedId(), vehicle, -1);
            SetEntityAsMissionEntity(vehicle, true, true);
            if (cb) cb(vehicle);
        } catch (error) {
            if (cb) cb(null, `Erreur lors du spawn du véhicule : ${error.message}`);
        }
    }


    async deleteVehicle(vehicle: number) {
        if (DoesEntityExist(vehicle)) {
            SetEntityAsMissionEntity(vehicle, false, true);
            DeleteVehicle(vehicle);
        }
    }

    getVehiclePlate(vehicle: number): string {
        return GetVehicleNumberPlateText(vehicle);
    }

    getVehicleProperties(vehicle) {
        if (DoesEntityExist(vehicle)) {
            const {pearlescentColor, wheelColor} = GetVehicleExtraColours(vehicle)
            const {primaryColor, secondaryColor} = GetVehicleColours(vehicle)
            const wheelType = GetVehicleWheelType(vehicle);
            const wheelVariation = GetVehicleMod(vehicle, 23);
            const model = GetEntityModel(vehicle);
            const modelName = GetDisplayNameFromVehicleModel(model);
            const plate = GetVehicleNumberPlateText(vehicle);
            const fuelLevel = GetVehicleFuelLevel(vehicle);
            const engineHealth = GetVehicleEngineHealth(vehicle);
            const bodyHealth = GetVehicleBodyHealth(vehicle);
            const fuelTankPosition = this.getVehicleFuelTankPosition(vehicle);

            return {
                model,
                modelName,
                plate,
                fuelLevel,
                engineHealth,
                bodyHealth,
                fuelTankPosition,
                primaryColor,
                secondaryColor,
                pearlescentColor,
                wheelColor,
                wheelType,
                wheelVariation,
            };
        }
    }

    async setVehicleColor(vehicle: number, primaryColor: number, secondaryColor: number) {
        if (DoesEntityExist(vehicle)) {
            SetVehicleColours(vehicle, primaryColor, secondaryColor);
        }
    }

    async setVehicleComponents(vehicle: number, modType: number, modIndex: number) {
        if (DoesEntityExist(vehicle)) {
            SetVehicleMod(vehicle, modType, modIndex, false);
        }
    }

    async applyVehicleDeformations(vehicle: number, deformationData: { position: Vector3; damage: number }[]) {
        if (DoesEntityExist(vehicle)) {
            for (const { position, damage } of deformationData) {
                SetVehicleDamage(vehicle, position[0], position[1], position[2], damage, 100.0, true);
            }
        }
    }

    getClosestVehicle(playerCoords: [number, number, number], radius: number): number | null {
        const vehicles = GetGamePool('CVehicle');
        let closestVehicle: number | null = null;
        let closestDistance: number = radius;

        for (const vehicle of vehicles) {
            if (DoesEntityExist(vehicle)) {
                const vehicleCoords = GetEntityCoords(vehicle, true) as [number, number, number];
                const distance = Math.sqrt(
                    Math.pow(vehicleCoords[0] - playerCoords[0], 2) +
                    Math.pow(vehicleCoords[1] - playerCoords[1], 2) +
                    Math.pow(vehicleCoords[2] - playerCoords[2], 2)
                );

                if (distance < closestDistance) {
                    closestVehicle = vehicle;
                    closestDistance = distance;
                }
            }
        }

        return closestVehicle;
    }

    getVehicleFuelTankPosition(vehicle: number): [number, number, number] {
        const tankBoneIndex = GetEntityBoneIndexByName(vehicle, "petroltank");
        if (tankBoneIndex !== -1) {
            return GetWorldPositionOfEntityBone(vehicle, tankBoneIndex) as [number, number, number];
        }

        // Fallback: Use the vehicle's coordinates if no petrol tank bone is found
        return GetEntityCoords(vehicle, true) as [number, number, number];
    }

    setVehiclePlate (vehicle: number, plate: string) {
        SetVehicleNumberPlateText(vehicle, plate);
    }

    static generatePlate(){
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
