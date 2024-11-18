import { Injectable, Inject } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";
import {Vehicle} from "@prisma/client";

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async spawnNewVehicle(playerId: number, modelName: string) {
        const ped = GetPlayerPed(playerId);
        if (!ped) {
            throw new Error('Le joueur spécifié est invalide ou introuvable.');
        }

        const [playerX, playerY, playerZ] = GetEntityCoords(ped);
        const heading = GetEntityHeading(ped);
        const vehicleType = GetVehicleType(GetHashKey(modelName));

        const vehicle = CreateVehicleServerSetter(modelName, vehicleType, playerX, playerY, playerZ, heading);

        if (vehicle === 0) {
            throw new Error('Échec du spawn du véhicule.');
        }

        console.log(`Véhicule spawné: ${modelName} pour le joueur ${playerId} aux coordonnées (${playerX}, ${playerY}, ${playerZ}).`);
        return vehicle;
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
}
