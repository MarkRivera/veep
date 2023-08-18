import { Request, Response, NextFunction } from "express";
import { AppError, RabbitConnectionError } from "../errors/errorClasses";
import { AppErrorHandler, RabbitConnectionErrorHandler } from "../errors/errorHandler";


export function errorHandler(err: AppError, req: Request, res: Response, _: NextFunction) {
  if (err instanceof RabbitConnectionError) {
    return new RabbitConnectionErrorHandler().handleError(err, req, res);
  } else {
    return new AppErrorHandler().handleError(err, req, res);
  }
}