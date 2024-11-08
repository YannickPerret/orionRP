import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from 'typeorm';
import type { User } from '../users/user.entity';

export enum RoleType {
    ADMIN = 'admin',
    HELPER = 'helper',
    DEVELOPER = 'developer',
    GUEST = 'guest',
    USER = 'user',
}

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({
        type: 'enum',
        enum: RoleType,
        unique: true,
    })
    name!: RoleType;

    @OneToMany('User', (user: User) => user.role)
    users!: User[];
}
