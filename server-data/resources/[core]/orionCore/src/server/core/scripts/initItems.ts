import 'reflect-metadata';
import AppDataSource from '../database/database';
import itemsData from '../../datas/items.json';
import {Item} from "../../modules/items/item.entity";

export default async function initItems() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const itemRepository = AppDataSource.getRepository(Item);

        // Traitez les données des itemsA
        for (const itemData of itemsData) {
            let item = await itemRepository.findOne({ where: { name: itemData.name } });
            if (!item) {
                item = itemRepository.create(itemData);
                if (item) {
                    await itemRepository.save(item);
                    console.log(`Item "${item.name}" créé.`);
                } else {
                    console.error(`Erreur lors de la création de l'item "${itemData.name}".`);
                }
            } else {
                console.log(`Item "${item.name}" existe déjà.`);
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des items:', error);
    }
}
