import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column()
    image!: string;

    @Column({ default: true })
    stackable!: boolean;

    @Column({ default: false })
    usable!: boolean;

    @Column({ type: 'simple-json', nullable: true })
    effects?: any;

    @Column({ type: 'simple-json', nullable: true })
    metadata?: any;
}
