import "reflect-metadata"
import { DataSource } from "typeorm"
// import { Company } from "./entity/Company"
// import { Station } from "./entity/Station"
// import { StationType } from "./entity/StationType"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "Zaebars13",
    database: "virtu",
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: [],
    subscribers: [],
})
