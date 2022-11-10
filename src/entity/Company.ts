import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToOne } from "typeorm"
import { Station } from "./Station"

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @OneToMany(() => Company, (company) => company.parentCompany)
    @JoinTable()
    childCompanys: Company[]

    @ManyToOne(() => Company, (company) => company.childCompanys)
    parentCompany: Company

    @OneToMany(() => Station, (station) => station.company)
    @JoinTable()
    stations: Station[]
}