import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Station } from "./Station"

@Entity()
export class StationType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    maxPower: number

    @OneToOne(() => Station)
    @JoinColumn()
    station: Station
}