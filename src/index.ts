import { Company } from "./entity/Company"
import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { deleteStationById, getParent, getCompanyStations, getAllChilds, getCompanys, getCompanyById, postCompany, deleteCompanyById, updateCompany, addChildCompany } from './controllers/companyControllers'
import { getStations, getStationById, postStation, updateStation, addStationCompany, stationType, addStationType} from './controllers/stationControllers'



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

const task1endpoint = async (req: Request, res: Response) => {
    const company = await AppDataSource.getRepository(Company).createQueryBuilder('company')
        .leftJoinAndSelect('company.childCompanies', 'childCompanies')
        .leftJoinAndSelect('company.stations', 'stations')
        .getMany()

    res.json(company)
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
app.get('/task', task1endpoint)


app.listen(5000)



