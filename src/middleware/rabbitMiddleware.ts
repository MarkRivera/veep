import { Response, NextFunction } from "express";
import { RabbitRequest } from "../../types";
import { RabbitClient } from "../util/rabbit";

export function rabbitMiddleware(client: RabbitClient) {
  return async (req: RabbitRequest, res: Response, next: NextFunction) => {
    let channel = await client.initialize();
    req.rabbitMQChannel = channel;

    next();
  }
}