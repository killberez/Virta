import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm"
import { Station } from "./Station"

@Entity()
export class StationType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    maxPower: number

    @OneToMany(() => Station, (station) => station.stationType)
    @JoinColumn()
    station: Station
}