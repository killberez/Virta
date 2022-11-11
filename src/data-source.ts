import "reflect-metadata"
import { DataSource } from "typeorm"
require("dotenv").config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATA_BASE,
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: [],
    subscribers: [],
})
