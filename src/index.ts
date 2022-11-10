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
    .then(async () => {
        // const station1 = new Station()
        // station1.name = 'station1'
        // await AppDataSource.manager.save(station1)

        // const station2 = new Station()
        // station2.name = 'station2'
        // await AppDataSource.manager.save(station2)

        // const station3 = new Station()
        // station3.name = 'station3'
        // await AppDataSource.manager.save(station3)

        // const station4 = new Station()
        // station4.name = 'station4'
        // await AppDataSource.manager.save(station4)

        // const station5 = new Station()
        // station5.name = 'station5'
        // await AppDataSource.manager.save(station5)

        // const company1 = new Company()
        // company1.name = "Shell"
        // await AppDataSource.manager.save(company1)

        // const company2 = new Company()
        // company2.name = "TatNeft"
        // await AppDataSource.manager.save(company2)

        // const company3 = new Company()
        // company3.name = "Luk"
        // await AppDataSource.manager.save(company3)
    })

    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


const app = express()
app.use(express.json())
app.use(bodyParser.json())

const getRawData = async (req: Request, res: Response) => {
    const rawData = await AppDataSource.manager.query(`SELECT * FROM company`)
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

const getStations = async (req: Request, res: Response) => {
    const stations = await AppDataSource.getRepository(Station).find()
    res.json(stations)
}

const getStationById = async (req: Request, res: Response) => {
    const { id } = req.params
    const station = await AppDataSource.getRepository(Station).findOneBy({ id: parseInt(id) })
    res.json(station)
}

const postCompany = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).create(req.body)
    const result = await AppDataSource.getRepository(Company).save(company)
    res.send(result)
}

const updateCompany = async (req: Request, res: Response) => {
    await AppDataSource
        .createQueryBuilder()
        .update(Company)
        .set({ name: req.body.name })
        .where("id = :id", { id: req.body.id })
        .execute()
    const company = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.id })
    if (req.body.child !== null) {
        const childCompany = await AppDataSource.getRepository(Company).findOneBy({ id: req.body.child })
        console.log(childCompany)
        const companyRepository = AppDataSource.manager.getRepository(Company)
        const company = await companyRepository.findOne({
            where: {
                id: req.body.child.id,
            },
            relations: {
                childCompanys: true,
            },
        })
        company.childCompanys.push(childCompany)
        await companyRepository.save(company)
        console.log(company.childCompanys)
    }
    res.json(company)
}

const postStation = async (req: Request, res: Response) => {
    const station = await AppDataSource.getRepository(Station).create(req.body)
    const results = await AppDataSource.getRepository(Station).save(station)
    res.send(results)
}

app.get('/', getRawData)
app.get("/company", getCompanys)
app.get("/station", getStations)
app.get('/company/:id', getCompanyById)
app.get('/station/:id', getStationById)
app.post("/company", postCompany)
app.post("/station", postStation)
app.post('/companyU', updateCompany)

app.listen(5000)
