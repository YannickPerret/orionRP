import { Injectable, Inject } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async spawnNewVehicle(playerId: number, modelHash: string) {
            const modelHashValue = typeof modelHash === 'string' ? GetHashKey(modelHash) : modelHash;

            const player = global.source
            const ped = GetPlayerPed(player);
            const [playerX, playerY, playerZ] = GetEntityCoords(ped);
            const heading = GetEntityHeading(ped)
            const vehicleType = GetVehicleType(modelHashValue)

            const vehicle = CreateVehicleServerSetter(modelHashValue, vehicleType, playerX, playerY, playerZ, heading);

            if (vehicle === 0) {
                throw new Error('Échec du spawn du véhicule.');
            }

            console.log(`Véhicule spawné: ${modelHash} pour le joueur ${playerId} aux coordonnées (${playerX}, ${playerY}, ${playerZ}).`);
            return vehicle;
    }

    async registerNewVehicle(characterId: number, vehicleData: Partial<any>) {
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
