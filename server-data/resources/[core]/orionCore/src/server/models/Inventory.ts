import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Character } from './Character';
import { InventoryItem } from './InventoryItem';

@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'float', default: 0 })
    weight!: number;

    @OneToOne(() => Character, character => character.inventory)
    character!: Character;

    @OneToMany(() => InventoryItem, item => item.inventory, { cascade: true })
    items!: InventoryItem[];
}
