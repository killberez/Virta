// import { AppDataSource } from "./data-source"
import { Company } from "./entity/Company"
import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


const app = express()
app.use(express.json())


app.get("/company", async function (req: Request, res: Response) {
    const companys = await AppDataSource.getRepository(Company).find()
    res.json(companys)
    console.log(companys)
})

app.post("/company", async function (req: Request, res: Response) {
    console.log(req.body)
    const company = await AppDataSource.getRepository(Company).create(req.body)
    const results = await AppDataSource.getRepository(Company).save(company)
    return res.send(results)
})

// start express server
app.listen(5000)
// AppDataSource.initialize().then(async () => {
//     const company = new Company()
//     company.name = "company1"
//     await AppDataSource.manager.save(company)
//     const companys = await AppDataSource.manager.find(Company)
//     console.log(companys)

// }).catch(error => console.log(error))