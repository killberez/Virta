import { Company } from "../entity/Company"
import { Station } from "../entity/Station"
import { StationType } from "../entity/StationType"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"



export const getStations = async (req: Request, res: Response) => {
    const stations = await AppDataSource.getRepository(Station).find()
    res.json(stations)
}

export const getStationById = async (req: Request, res: Response) => {
    const { id } = req.params
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: parseInt(id) })
    res.json(station)
}

export const postStation = async (req: Request, res: Response) => {
    const station = await AppDataSource.getRepository(Station).create(req.body)
    const results = await AppDataSource.getRepository(Station).save(station)
    res.send(results)
}

export const updateStation = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Station)
        .set({ name: req.body.name })
        .where("id = :id", { id: req.body.id })
        .execute()
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: req.body.id })
    res.json(station)
}

export const addStationCompany = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.id })
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: req.body.station })
    if (req.body.station !== null) {
        await AppDataSource
            .createQueryBuilder()
            .relation(Company, "stations")
            .of(company)
            .add(station)
    }
    res.json(company)
}

export const stationType = async (req: Request, res: Response) => {
    const stationType = await AppDataSource.getRepository(StationType).create(req.body)
    const results = await AppDataSource.getRepository(StationType).save(stationType)
    res.send(results)
}

export const addStationType = async (req: Request, res: Response) => {
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: req.body.id })
    const stationType = await AppDataSource.getRepository(StationType).findOneBy({ id: req.body.type })
    await AppDataSource
        .createQueryBuilder()
        .relation(Station, "stationType")
        .of(station)
        .set(stationType)
    res.json(station)
}