import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { User } from './User';

export enum RoleType {
    ADMIN = 'admin',
    HELPER = 'helper',
    DEVELOPER = 'developer',
    GUEST = 'guest',
    USER = 'user',
}

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: RoleType,
        unique: true,
    })
    name!: RoleType;

    @OneToMany(() => User, user => user.role)
    users!: User[];
}
