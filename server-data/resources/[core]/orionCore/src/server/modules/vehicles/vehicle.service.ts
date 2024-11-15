import { Injectable, Inject } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async createVehicle(characterId: number, vehicleData: Partial<any>) {
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
        const vehicle = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: updateData,
        });

        return vehicle;
    }

    async deleteVehicle(vehicleId: string): Promise<void> {
        await this.prisma.vehicle.delete({
            where: { id: vehicleId },
        });
    }
}
