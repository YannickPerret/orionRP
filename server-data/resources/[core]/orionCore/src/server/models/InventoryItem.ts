import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Inventory } from './Inventory';
import { Item } from './Item';

@Entity('inventory_items')
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: 1 })
    quantity!: number;

    @ManyToOne(() => Inventory, inventory => inventory.items)
    inventory!: Inventory;

    @ManyToOne(() => Item)
    item!: Item;
}
