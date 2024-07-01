import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = process.env.DB_NAME as string;
const username = process.env.DB_USER as string;
const password = process.env.DB_PASSWORD as string;
const host = process.env.DB_HOST as string;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
