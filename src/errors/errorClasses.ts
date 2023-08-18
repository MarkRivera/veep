export class AppError extends Error {
  readonly message: string;
  readonly statusCode: number;
  isCritial: boolean;

  constructor(message: string, statusCode: number, isCritial: boolean = false) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.isCritial = isCritial;
  }
}

export class RabbitConnectionError extends AppError {
  constructor(message: string) {
    super(message, 500, true);
  }
}