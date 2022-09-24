import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:4200']
}))

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
})

app.listen(3000, () => {
  console.log('listening on port 3000');
})