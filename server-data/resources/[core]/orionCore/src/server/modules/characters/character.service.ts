import { Character, UserGender } from './character.entity';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import InventoryService from "../inventories/inventory.service";

interface CharacterCreationData {
    firstName: string;
    lastName: string;
    gender: UserGender;
    appearance?: any;
    clothes?: any;
    model?: string;
}

export class CharacterService {
    private userService: UserService;
    private inventoryService = InventoryService;

    constructor() {
        this.userService = new UserService();
    }

    async createCharacter(userId: number, characterData: CharacterCreationData): Promise<Character> {
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const character = new Character();
            character.userId = userId;
            character.firstName = characterData.firstName;
            character.lastName = characterData.lastName;
            character.gender = characterData.gender;
            character.appearance = characterData.appearance;
            character.clothes = characterData.clothes;
            character.model = characterData.model;
            character.position = { x: -1037.79, y: -2737.87, z: 13.77 };
            character.money = 500;
            character.bank = 1000;

            character.inventory = await this.inventoryService.createInventory(character)
            await character.save();

            return character;
        } catch (error) {
            throw new Error(`Erreur lors de la création du personnage: ${error.message}`);
        }
    }

    async loadCharacter(playerId: number, userId: number): Promise<Character> {
        try {
            const user = await User.findOne({
                where: { id: userId },
                relations: ['characters']
            });

            if (!user || !user.activeCharacter) {
                throw new Error('Aucun personnage actif trouvé');
            }

            const character = await Character.findOne({
                where: { id: user.activeCharacter },
                relations: ['inventory', 'vehicles']
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            // Appliquer les données du personnage au joueur
            await this.applyCharacterToPlayer(playerId, character);

            return character;
        } catch (error) {
            throw new Error(`Erreur lors du chargement du personnage: ${error.message}`);
        }
    }

    private async applyCharacterToPlayer(playerId: number, character: Character): Promise<void> {
        // Définir le modèle du personnage
        SetPlayerModel(playerId, character.model || 'mp_m_freemode_01');

        // Appliquer l'apparence
        if (character.appearance) {
            // Implémentez votre logique d'application d'apparence ici
            // Exemple : SetPedComponentVariation, etc.
        }

        // Appliquer les vêtements
        if (character.clothes) {
            // Implémentez votre logique d'application des vêtements
        }

        // Définir la position
        if (character.position) {
            SetEntityCoords(
                GetPlayerPed(playerId),
                character.position.x,
                character.position.y,
                character.position.z,
                false, false, false, false
            );
        }

        // Définir la santé et l'armure
        SetEntityHealth(GetPlayerPed(playerId), character.health);
        SetPedArmour(GetPlayerPed(playerId), character.armor);
    }

    async saveCharacter(playerId: number): Promise<void> {
        try {
            const identifier = this.userService.getPlayerIdentifier(playerId);
            if (!identifier) {
                throw new Error('Identifiant non trouvé');
            }

            const user = await this.userService.findUserByIdentifier(identifier);
            if (!user || !user.activeCharacter) {
                throw new Error('Aucun personnage actif trouvé');
            }

            const character = await Character.findOne({
                where: { id: user.activeCharacter }
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            // Sauvegarder la position actuelle
            const ped = GetPlayerPed(playerId);
            character.position = GetEntityCoords(ped);

            // Sauvegarder la santé et l'armure
            character.health = GetEntityHealth(ped);
            character.armor = GetPedArmour(ped);

            // Sauvegarder l'inventaire si nécessaire
            await this.inventoryService.saveInventory(character.inventory);

            await character.save();
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde du personnage: ${error.message}`);
        }
    }

    async getAllCharacters(userId: number): Promise<Character[]> {
        try {
            return await Character.find({
                where: { userId },
                relations: ['inventory', 'vehicles']
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des personnages: ${error.message}`);
        }
    }

    async updateCharacterAppearance(
        characterId: number,
        appearance: any,
        clothes: any
    ): Promise<Character> {
        try {
            const character = await Character.findOne({
                where: { id: characterId }
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            character.appearance = appearance;
            character.clothes = clothes;
            await character.save();

            return character;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'apparence: ${error.message}`);
        }
    }

    async deleteCharacter(characterId: number): Promise<void> {
        try {
            const character = await Character.findOne({
                where: { id: characterId }
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            // Supprimer l'inventaire associé
            if (character.inventory) {
                await this.inventoryService.deleteInventory(character.inventory.id);
            }

            await character.remove();
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du personnage: ${error.message}`);
        }
    }

    async updateCharacterStats(
        characterId: number,
        stats: {
            hunger?: number;
            thirst?: number;
            health?: number;
            armor?: number;
        }
    ): Promise<Character> {
        try {
            const character = await Character.findOne({
                where: { id: characterId }
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            // Mettre à jour uniquement les stats fournies
            if (stats.hunger !== undefined) character.hunger = stats.hunger;
            if (stats.thirst !== undefined) character.thirst = stats.thirst;
            if (stats.health !== undefined) character.health = stats.health;
            if (stats.armor !== undefined) character.armor = stats.armor;

            await character.save();
            return character;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour des stats: ${error.message}`);
        }
    }

    async switchCharacter(userId: number, characterId: number): Promise<void> {
        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const character = await Character.findOne({
                where: { id: characterId, userId }
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            user.activeCharacter = characterId;
            await user.save();
        } catch (error) {
            throw new Error(`Erreur lors du changement de personnage: ${error.message}`);
        }
    }
}