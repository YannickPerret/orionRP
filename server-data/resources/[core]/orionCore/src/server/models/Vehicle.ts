import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('vehicle')
export class Vehicle {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    model!: string

    @Column()
    plate!: string

    @Column({ type: 'simple-json', nullable: true })
    appearance?: any;
}
