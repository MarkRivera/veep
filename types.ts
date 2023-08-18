import { Request } from 'express';
import ampq from "amqplib";


export type RedisTask = {
  chunkName: string,
  chunkNumber: number,
  filename: string,
  data: string,
  totalChunks: number
}

export interface RabbitRequest extends Request {
  rabbitMQChannel: ampq.Channel | null;
}

declare module 'express-serve-static-core' {
  interface Request {
    rabbitMQChannel: ampq.Channel | null;
  }
}
