import express, { Application } from "express";
import cors from "cors";
import env from "dotenv";
import { main } from "./main";
import { dbConfig } from "./util/dbConfig";
env.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
main(app);
app.listen(parseInt(process.env.PORT as string), () => {
  dbConfig();
});
