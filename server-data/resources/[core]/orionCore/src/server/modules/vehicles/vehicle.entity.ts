import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import type { Character } from '../characters/character.entity';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ type: 'varchar' })
    model!: string;

    @Column({ type: 'varchar' })
    plate!: string;

    @Column({ type: 'float' })
    positionX!: number;

    @Column({ type: 'float' })
    positionY!: number;

    @Column({ type: 'float' })
    positionZ!: number;

    @Column({ type: 'boolean', default: false })
    isImpounded!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne('Character', (character: Character) => character.vehicles, { onDelete: 'CASCADE' })
    character!: Character;
}
