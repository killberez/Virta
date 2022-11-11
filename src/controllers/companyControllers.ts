import { Company } from "../entity/Company"
import { Station } from "../entity/Station"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"


AppDataSource
    .initialize()
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


export const getCompanys = async (req: Request, res: Response) => {
    const companys = await AppDataSource.getRepository(Company).find()
    res.json(companys)
}

export const getCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: parseInt(id) })
    res.json(company)
}

export const postCompany = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).create(req.body)
    const result = await AppDataSource.getRepository(Company).save(company)
    res.send(result)
}

export const deleteCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params
    await AppDataSource.getRepository(Company).delete(parseInt(id))
    res.json("deleted")
}

export const updateCompany = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Company)
        .set({ name: req.body.name })
        .where("id = :id", { id: req.body.id })
        .execute()
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.id })
    res.json(company)
}

export const addChildCompany = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.id })
    const childCompany = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.child })
    if (req.body.child !== null) {
        await AppDataSource
            .createQueryBuilder()
            .relation(Company, "childCompanies")
            .of(company)
            .add(childCompany)
    }
    res.json(company)
}

export const getParent = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.manager.findOneBy(Company, {
        id: parseInt(id),
    })
    company.parentCompany = await AppDataSource
        .createQueryBuilder()
        .relation(Company, "parentCompany")
        .of(company)
        .loadOne()
    res.json(company)
}

export const getAllChilds = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.manager.findOneBy(Company, {
        id: parseInt(id),
    })
    company.childCompanies = await AppDataSource
        .createQueryBuilder()
        .relation(Company, "childCompanies")
        .of(company)
        .loadMany()
    res.json(company)
}

export const getCompanyStations = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.manager.findOneBy(Company, {
        id: parseInt(id),
    })
    company.stations = await AppDataSource
        .createQueryBuilder()
        .relation(Company, "stations")
        .of(company)
        .loadMany()
    res.json(company)
}

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

export const deleteStationById = async (req: Request, res: Response) => {
    const { id } = req.params
    await AppDataSource.getRepository(Station).delete(parseInt(id))
    res.json("deleted")
}