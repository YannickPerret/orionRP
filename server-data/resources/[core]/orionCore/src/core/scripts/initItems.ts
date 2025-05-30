import itemsData from '../../server/datas/items.json';
import {Inject, Injectable} from "../decorators";
import {PrismaService} from "../database/PrismaService";

@Injectable()
export default class ItemInitializer {
    @Inject(PrismaService)
    private prisma!: PrismaService;


    async initItems() {
        console.log("lol")
        try {
            for (const itemData of itemsData) {
                const existingItem = await this.prisma.item.findUnique({
                    where: { name: itemData.name },
                });

                if (!existingItem) {
                    const newItem = await this.prisma.item.create({
                        data: itemData,
                    });

                    if (newItem) {
                        console.log(`Item "${newItem.name}" créé.`);
                    } else {
                        console.error(`Erreur lors de la création de l'item "${itemData.name}".`);
                    }
                } else {
                    console.log(`Item "${existingItem.name}" existe déjà.`);
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des items:', error);
        }
    }
}
