import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity, OneToMany
} from 'typeorm';

import type { InventoryItem } from '../inventoryItems/inventoryItem.entity';


@Entity('items')
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ type: 'varchar', unique: true })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'varchar' })
    image!: string;

    @Column({ type: 'boolean', default: true })
    stackable!: boolean;

    @Column({ type: 'boolean', default: false })
    usable!: boolean;

    @Column({ type: 'simple-json', nullable: true })
    effects?: any;

    @Column({ type: 'simple-json', nullable: true })
    metadata?: any;

    @OneToMany('InventoryItem', (inventoryItem: InventoryItem) => inventoryItem.item)
    inventoryItems!: InventoryItem[];


    static findByName(name: string) {
        return this.createQueryBuilder('item')
            .where("item.name = :name", { name })
            .getOne();
    }
}
