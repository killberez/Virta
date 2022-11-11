import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { StationType } from "./StationType";
import { Company } from "./Company";

@Entity()
export class Station {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @ManyToOne(() => StationType)
    @JoinColumn()
    stationType: StationType

    @ManyToOne(() => Company)
    company: Company
}