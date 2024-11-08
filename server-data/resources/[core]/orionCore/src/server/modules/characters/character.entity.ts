import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import type { User } from '../users/user.entity';
import type { Inventory} from "../inventories/inventory.entity";
import type { Vehicle} from "../vehicles/vehicle.entity";


export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
}

@Entity('characters')
export class Character extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ type: 'int' })
    userId!: number;

    @Column({ type: 'varchar' })
    firstName!: string;

    @Column({ type: 'varchar' })
    lastName!: string;

    @Column({
        type: 'enum',
        enum: UserGender,
        default: UserGender.MALE,
    })
    gender!: UserGender;

    @Column({ type: 'varchar', nullable: true })
    model?: string;

    @Column({ type: 'simple-json', nullable: true })
    appearance?: any;

    @Column({ type: 'simple-json', nullable: true })
    clothes?: any;

    @Column({ type: 'simple-json', nullable: true })
    weapons?: any;

    @Column({ type: 'int', default: 500 })
    money!: number;

    @Column({ type: 'int', default: 0 })
    bank!: number;

    @Column({ type: 'simple-json' })
    position!: any;

    @Column({ type: 'float', default: 100 })
    hunger!: number;

    @Column({ type: 'float', default: 100 })
    thirst!: number;

    @Column({ type: 'float', default: 100 })
    health!: number;

    @Column({ type: 'float', default: 0 })
    armor!: number;

    @Column({ type: 'boolean', default: false })
    isDead!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne('User', (user: User) => user.characters)
    user!: User;

    @OneToOne('Inventory', (inventory: Inventory) => inventory.character, { cascade: true })
    @JoinColumn()
    inventory!: Inventory;

    @OneToMany('Vehicle', (vehicle: Vehicle) => vehicle.character, { cascade: true })
    vehicles!: Vehicle[];

    get fullname(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
