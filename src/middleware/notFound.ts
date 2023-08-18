import { Request, Response } from 'express';

export function notFound(_: Request, res: Response) {
  res.status(404).send('404 Not Found');
}