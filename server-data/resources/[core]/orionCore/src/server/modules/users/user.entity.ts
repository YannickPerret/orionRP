import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    BaseEntity
} from 'typeorm';
import type { Character } from '../characters/character.entity';
import type {Role} from "../roles/role.entity";

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ type: 'varchar', unique: true })
    identifier: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    steamId?: string;

    @Column({ type: 'varchar', nullable: true })
    ip?: string;

    @Column({ type: 'timestamp', nullable: true })
    lastConnection?: Date;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', unique: true })
    username: string;

    @Column({ type: 'boolean', default: false })
    active: boolean;

    @Column({ type: 'int', select: false, nullable: true })
    source?: number;

    @Column({ type: 'int', nullable: true })
    activeCharacter?: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne('Role', (role: Role) => role.users)
    role!: Role;

    @OneToMany('Character', (character: Character) => character.user)
    characters!: Character[];
}
