import { Injectable, Inject } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";
import {Vehicle} from "@prisma/client";
import {Delay} from "../../../utils/fivem";

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async spawnNewVehicle(playerId: number, modelName: string, position?: [number, number, number, number], warp: boolean = true): Promise<[number, number]> {
        if (!position) {
            const ped = GetPlayerPed(playerId);
            if (!ped) {
                throw new Error('Le joueur spécifié est invalide ou introuvable.');
            }
            const [x, y, z] = GetEntityCoords(ped, true) as [number, number, number];
            const heading = GetEntityHeading(ped);
            position = [x, y, z, heading];
        }

        const modelHash = typeof modelName === 'string' ? GetHashKey(modelName) : modelName;
        const vehicleType = typeof modelName === 'string' ? 'automobile' : 'aircraft';
        const [x, y, z, heading] = position;

        const vehicle = CreateVehicleServerSetter(modelHash, vehicleType, x, y, z, heading);

        while (!DoesEntityExist(vehicle)) {
            await Delay(10);
        }
        if (warp) {
            await Delay(400)
            TaskWarpPedIntoVehicle(GetPlayerPed(playerId), vehicle, -1);
        }
        const networkId = NetworkGetNetworkIdFromEntity(vehicle);
        return [networkId, vehicle];
    }


    async registerNewVehicle(characterId: number, vehicleData: Partial<any>): Promise<Vehicle> {
        const character = await this.prisma.character.findUnique({ where: { id: characterId } });
        if (!character) {
            throw new Error('Personnage non trouvé');
        }

        return this.prisma.vehicle.create({
            data: {
                ...vehicleData,
                character: {
                    connect: {id: characterId},
                },
            },
        });
    }

    async getVehicleById(vehicleId: string) {
        return this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: { character: true },
        });
    }

    async getVehiclesByCharacter(characterId: string) {
        return this.prisma.vehicle.findMany({
            where: { characterId },
        });
    }

    async updateVehicle(vehicleId: string, updateData: Partial<any>) {
        return this.prisma.vehicle.update({
            where: {id: vehicleId},
            data: updateData,
        });
    }

    async deleteVehicle(vehicleId: string): Promise<void> {
        await this.prisma.vehicle.delete({
            where: { id: vehicleId },
        });
    }

    generateVehiclePlate(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let plate = '';
        for (let i = 0; i < 8; i++) {
            plate += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return plate;
    }
}
