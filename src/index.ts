import express, { Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { routes } from "./routes";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

createConnection().then(() => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use(cors({
    origin: ['http://localhost:4200']
  }))

  app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
  })

  routes(app);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  })
})

