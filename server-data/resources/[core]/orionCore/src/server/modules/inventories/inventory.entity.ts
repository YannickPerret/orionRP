import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    BaseEntity, OneToMany
} from 'typeorm';

import type { Character } from '../characters/character.entity';
import type { InventoryItem } from '../inventoryItems/inventoryItem.entity';

@Entity('inventories')
export class Inventory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ type: 'float', default: 0 })
    weight: number;

    @OneToOne('Character', (character: Character) => character.inventory)
    character!: Character;

    @OneToMany('InventoryItem', (inventoryItem: InventoryItem) => inventoryItem.inventory)
    items!: InventoryItem[];
}
