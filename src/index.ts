// LOAD ENV
import dotenv from "dotenv";
dotenv.config();


import express, { Request, Response} from "express";

import cors from "cors"; // CORS
import helmet from "helmet"; // Security
import sequelize from "./db/db_config";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Helmet
app.use(helmet());

// Test Route
app.get("/", async (req , res) => {
  res.send("Server Working Fine !!");
});


const main = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database Connected Successfully");

    // Start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();