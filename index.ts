import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from "fs";
import md5 from "md5";
import cors from "cors";
import bodyParser from "body-parser";
import { RedisTask } from './types';
import ampq from "amqplib";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
app.use(cors({
  origin: process.env.ORIGIN_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

}));
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '200mb' }));

// RabbitMQ Connection
let channel: ampq.Channel | null = null;

app.get('/health-check', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post("/api/v1/videos/upload", async function uploadHandler(req: Request, res: Response, next: NextFunction) {
  const { name, size, currentChunk, totalChunks, type, isLastChunk } = req.query;

  if (isParamsMissing(req)) {
    return res.status(400).send({ message: "Missing query parameters" });
  }

  if (isRequestValid(req)) {
    return res.status(400).send({ message: "Query parameters are not strings" });
  }

  const tmpFileName = createTmpFilename(name as string, req.ip);
  const data = req.body.toString().split(',')[1];

  // Create and Send Task to Redis
  const chunk_name = createChunkName(parseInt(currentChunk as string), tmpFileName);
  const task = createTask(
    parseInt(currentChunk as string),
    parseInt(totalChunks as string),
    tmpFileName,
    data, // Base64 Encoded String
    chunk_name
  );

  sendToQueue(task);

  res.json({
    msg: "Data Received, processing video."
  })
})

app.get("/sendMockTask", async function sendTask(req: Request, res: Response, next: NextFunction) {
  const task = {
    "hello": "Mel"
  }

  if (channel) {
    channel.sendToQueue("video_queue", Buffer.from(JSON.stringify(task)));
    return res.json({
      msg: "Task sent"
    })
  }

  return res.status(500).json({
    msg: "Channel not initialized"
  })
})

app.listen(port, async () => {
  const queue = "video_queue";
  const connection = await ampq.connect(process.env.RABBITMQ_URL as string);
  connection.on("error", (err) => {
    console.log("Error connecting to RabbitMQ", err);
  });

  channel = await connection.createChannel();
  await channel.assertQueue(queue, {
    durable: true
  }).then(() => {
    console.log("Queue created or exists");
  });


  process.on("exit", () => {
    channel?.close();
    connection.close();
  })

  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


async function sendToQueue(task: RedisTask) {
  if (channel) {
    channel.sendToQueue("video_queue", Buffer.from(JSON.stringify(task)));
  }
}

// Redis Message Data Structure for Queue
// chunk_number::filename -> { data, totalChunks }

function createTask(chunkNumber: number, totalChunks: number, filename: string, data: string, chunkName: string): RedisTask {
  return {
    chunkName,
    chunkNumber,
    filename,
    data,
    totalChunks
  }
}

function createChunkName(chunk_number: number, filename: string) {
  return chunk_number + "::" + filename;
}

function isRequestValid(req: Request) {
  const { name, size, currentChunk, totalChunks, type } = req.query;
  return (
    typeof name !== "string" ||
    typeof size !== "string" ||
    typeof currentChunk !== "string" ||
    typeof totalChunks !== "string" ||
    typeof type !== "string"
  )
}

function isParamsMissing(req: Request): boolean {
  const { name, size, currentChunk, totalChunks, type } = req.query;
  return !name || !size || !currentChunk || !totalChunks || !type;
}

function createTmpFilename(name: string, ip: string) {
  const ext = name.split('.')[1];
  return md5(name + ip) + '.' + ext;
}