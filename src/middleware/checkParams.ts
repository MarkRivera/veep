import { Request, Response, NextFunction } from 'express';

export function checkParams(req: Request, res: Response, next: NextFunction) {
  if (isParamsMissing(req)) {
    return res.status(400).send({ message: "Missing query parameters" });
  }

  next();
}

function isParamsMissing(req: Request): boolean {
  const { name, size, currentChunk, totalChunks, type } = req.query;
  return !name || !size || !currentChunk || !totalChunks || !type;
}