import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class StationType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    maxPower: number
}