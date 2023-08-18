import { Request, Response } from 'express';
import { AppError } from './errorClasses';

export abstract class ErrorHandler {
  public handleError(err: AppError, _: Request | null, res: Response | null) {
    this.logError(err);
    this.retry(err);

    if (res) return this.respond(err, res);
  }

  protected logError(err: AppError) {
    console.error(err.stack);
  }

  protected retry(_: AppError) { }


  protected respond(err: AppError, res: Response) {
    return res.status(err.statusCode).json({
      msg: err.message,
      statusCode: err.statusCode,
      okay: false
    })
  }
}

export class AppErrorHandler extends ErrorHandler { }

export class RabbitConnectionErrorHandler extends ErrorHandler {
  protected retry(err: Error) {
    // retry logic
    console.log("Retrying connection to RabbitMQ...");
  }
}