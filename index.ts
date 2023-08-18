import express, { Express, NextFunction, Request, Response } from 'express';
import { rabbitMiddleware } from './src/middleware/rabbitMiddleware';
import { rabbitClient } from './src/util/rabbit';

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';

import userRoutes from "./src/routes/v1/users";
import videoRoutes from "./src/routes/v1/videos";

import { errorHandler } from './src/middleware/errorHandler';
import { notFound } from './src/middleware/notFound';
import { AppError, RabbitConnectionError } from './src/errors/errorClasses';
import { AppErrorHandler, RabbitConnectionErrorHandler } from './src/errors/errorHandler';

dotenv.config();
const port = process.env.PORT;

async function startServer() {
  const app: Express = express();
  app.use(cors({}));
  app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '200mb' }));

  app.use(rabbitMiddleware(rabbitClient));

  app.use("/api/v1/users", userRoutes)
  app.use("/api/v1/videos", videoRoutes)

  app.get('/api/v1/health-check', (_, res: Response) => {
    res.send("I'm Happy and Healthy :)");
  });

  app.get("/api/v1/sendMockTask", async function sendTask(req: Request, res: Response, next: NextFunction) {
    const task = {
      "hello": "Mel"
    }

    if (!req.rabbitMQChannel) {
      next(new RabbitConnectionError("This feature is not available at the moment, please try again later!"))
    } else {
      req.rabbitMQChannel.sendToQueue("video_queue", Buffer.from(JSON.stringify(task)));
      return res.json({
        msg: "Video Successfully Uploaded"
      })
    }
  })

  app.use(errorHandler);
  app.use(notFound);

  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

startServer();

process.on("uncaughtException", (err) => {
  if (err instanceof RabbitConnectionError) {
    new RabbitConnectionErrorHandler().handleError(err, null, null);
  } else {
    let appErr = new AppError(err.message, 500, true)
    new AppErrorHandler().handleError(appErr, null, null);
  }

  return process.exit(1);
})