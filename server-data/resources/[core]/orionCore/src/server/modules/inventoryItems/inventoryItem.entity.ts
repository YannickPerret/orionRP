import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm';
import type { Inventory } from '../inventories/inventory.entity';
import type { Item } from '../items/item.entity';


@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne('Inventory', (inventory: Inventory) => inventory.items)
    inventory!: Inventory;

    @ManyToOne('Item', (item: Item) => item.inventoryItems)
    item!: Item;

}
