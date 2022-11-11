import { Company } from "./entity/Company"
import { Station } from "./entity/Station"
import { StationType } from "./entity/StationType"
import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { read, stat } from "fs"
const bodyParser = require('body-parser')



AppDataSource
    .initialize()
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


const app = express()
app.use(express.json())
app.use(bodyParser.json())

const getRawData = async (req: Request, res: Response) => {
    const rawData = await AppDataSource.manager.query(`SELECT * FROM station`)
    res.json(rawData)
}

const getCompanys = async (req: Request, res: Response) => {
    const companys = await AppDataSource.getRepository(Company).find()
    res.json(companys)
}

const getCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: parseInt(id) })
    res.json(company)
}

const postCompany = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).create(req.body)
    const result = await AppDataSource.getRepository(Company).save(company)
    res.send(result)
}

const deleteCompanyById = async (req: Request, res: Response) => {
    const { id } = req.params
    await AppDataSource.getRepository(Company).delete(parseInt(id))
    res.json("deleted")
}

const updateCompany = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Company)
        .set({ name: req.body.name })
        .where("id = :id", { id: req.body.id })
        .execute()
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.id })
    res.json(company)
}

const addChildCompany = async (req: Request, res: Response) => {
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

const getParent = async (req: Request, res: Response) => {
    const { id } = req.params
    const company = await AppDataSource.manager.findOneBy(Company, {
        id: parseInt(id),
    })
    console.log(company)
    company.parentCompany = await AppDataSource
        .createQueryBuilder()
        .relation(Company, "parentCompany")
        .of(company)
        .loadOne()
    res.json(company)
}

const getAllChilds = async (req: Request, res: Response) => {
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

const getCompanyStations = async (req: Request, res: Response) => {
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

const getStations = async (req: Request, res: Response) => {
    const stations = await AppDataSource.getRepository(Station).find()
    res.json(stations)
}

const getStationById = async (req: Request, res: Response) => {
    const { id } = req.params
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: parseInt(id) })
    res.json(station)
}

const postStation = async (req: Request, res: Response) => {
    const station = await AppDataSource.getRepository(Station).create(req.body)
    const results = await AppDataSource.getRepository(Station).save(station)
    res.send(results)
}

const updateStation = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Station)
        .set({ name: req.body.name })
        .where("id = :id", { id: req.body.id })
        .execute()
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: req.body.id })
    res.json(station)
}

const deleteStationById = async (req: Request, res: Response) => {
    const { id } = req.params
    await AppDataSource.getRepository(Station).delete(parseInt(id))
    res.json("deleted")
}

const addStationCompany = async (req: Request, res: Response) => {
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

const stationType = async (req: Request, res: Response) => {
    const stationType = await AppDataSource.getRepository(StationType).create(req.body)
    const results = await AppDataSource.getRepository(StationType).save(stationType)
    res.send(results)
}

const addStationType = async (req: Request, res: Response) => {
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: req.body.id })
    const stationType = await AppDataSource.getRepository(StationType).findOneBy({ id: req.body.type })
    console.log(stationType)
    await AppDataSource
        .createQueryBuilder()
        .relation(Station, "stationType")
        .of(station)
        .set(stationType)
    res.json(station)
}

const task1endpoint = async(req: Request, res: Response) => {
   
}


app.get('/', getRawData)
app.get("/company", getCompanys)
app.get('/company/:id', getCompanyById)
app.post("/company", postCompany)
app.post('/company-update', updateCompany)
app.delete('/company/:id', deleteCompanyById)
app.get('/company/childs/:id', getAllChilds)
app.get('/company/parent/:id', getParent)
app.post('/company/add-child', addChildCompany)
app.get('/company/station/:id', getCompanyStations)

app.get("/station", getStations)
app.get('/station/:id', getStationById)
app.post("/station", postStation)
app.post('/station-update', updateStation)
app.delete('/station/:id', deleteStationById)
app.post('/station/company', addStationCompany)
app.post('/station/type', addStationType)
app.post('/station-type', stationType)


app.listen(5000)
