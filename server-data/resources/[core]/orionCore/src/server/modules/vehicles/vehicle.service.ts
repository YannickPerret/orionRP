import { getRepository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Character } from '../characters/character.entity';

export class VehicleService {
    async createVehicle(characterId: number, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
        const character = await getRepository(Character).findOne(characterId);
        if (!character) {
            throw new Error('Personnage non trouvé');
        }

        const vehicle = getRepository(Vehicle).create({
            ...vehicleData,
            character: character,
        });
        await getRepository(Vehicle).save(vehicle);
        return vehicle;
    }

    async getVehicleById(vehicleId: number): Promise<Vehicle | undefined> {
        return await getRepository(Vehicle).findOne({ where: { id: vehicleId }, relations: ['character'] });
    }

    async getVehiclesByCharacter(characterId: number): Promise<Vehicle[]> {
        return await getRepository(Vehicle).find({ where: { character: { id: characterId } }, relations: ['character'] });
    }

    async updateVehicle(vehicleId: number, updateData: Partial<Vehicle>): Promise<Vehicle | null> {
        const vehicleRepo = getRepository(Vehicle);
        const vehicle = await vehicleRepo.findOne(vehicleId);
        if (!vehicle) {
            return null;
        }

        Object.assign(vehicle, updateData);
        await vehicleRepo.save(vehicle);
        return vehicle;
    }

    async deleteVehicle(vehicleId: number): Promise<void> {
        await getRepository(Vehicle).delete(vehicleId);
    }
}
