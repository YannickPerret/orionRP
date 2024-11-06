import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Inventory } from './Inventory';

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
}

@Entity('characters')
export class Character {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        type: 'enum',
        enum: UserGender,
        default: UserGender.MALE,
    })
    gender!: UserGender;

    @Column({ nullable: true })
    model?: string;

    @Column({ type: 'simple-json', nullable: true })
    appearance?: any;

    @Column({ type: 'simple-json', nullable: true })
    clothes?: any;

    @Column({ type: 'simple-json', nullable: true })
    weapons?: any;

    @Column({ default: 500 })
    money!: number;

    @Column({ default: 0 })
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

    @Column({ default: false })
    isDead!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, user => user.characters)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @OneToOne(() => Inventory, inventory => inventory.character, { cascade: true })
    @JoinColumn()
    inventory!: Inventory;
}
