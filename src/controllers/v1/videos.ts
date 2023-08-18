import { Request, Response, NextFunction } from 'express';
import { RedisTask } from '../../../types';

import ampq from "amqplib";
import md5 from "md5";
import { RabbitConnectionError } from '../../errors/errorClasses';

export async function uploadHandler(req: Request, res: Response, next: NextFunction) {
  const { name, currentChunk, totalChunks } = req.query;

  const tmpFileName = createTmpFilename(name as string, req.ip);
  const data = req.body.toString().split(',')[1];

  const chunk_name = createChunkName(parseInt(currentChunk as string), tmpFileName);
  const task = createTask(
    parseInt(currentChunk as string),
    parseInt(totalChunks as string),
    tmpFileName,
    data, // Base64 Encoded String
    chunk_name
  );

  if (!req.rabbitMQChannel) {
    next(new RabbitConnectionError("This feature is not available at the moment, please try again later!"))
  } else {
    sendToQueue(task, req.rabbitMQChannel);
    return res.json({
      msg: "Video Successfully Uploaded",
      okay: true,
      statusCode: 200
    })
  }
}

async function sendToQueue(task: RedisTask, channel: ampq.Channel) {
  channel.sendToQueue("video_queue", Buffer.from(JSON.stringify(task)));
}

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

function createTmpFilename(name: string, ip: string) {
  const ext = name.split('.')[1];
  return md5(name + ip) + '.' + ext;
}