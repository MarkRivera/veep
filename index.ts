import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { driver } from './events';
import { TaskQueue } from './events/task_queue';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  driver.emit("Ready", "test")
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});