import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Role } from './Role';
import { Character } from './Character';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    identifier!: string;

    @Column({ unique: true, nullable: true })
    steamId?: string;

    @Column({ nullable: true })
    ip?: string;

    @Column({ type: 'timestamp', nullable: true })
    lastConnection?: Date;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ default: false })
    active!: boolean;

    @Column({ select: false, nullable: true })
    source?: number;

    @Column({ nullable: true })
    activeCharacter?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn()
    role!: Role;

    @OneToMany(() => Character, character => character.user, { cascade: true })
    characters!: Character[];
}
