import { Request, Response, NextFunction } from "express";
export function validateParams(req: Request, res: Response, next: NextFunction) {
  const { name, size, currentChunk, totalChunks, type } = req.query;
  if (
    typeof name !== "string" ||
    typeof size !== "string" ||
    typeof currentChunk !== "string" ||
    typeof totalChunks !== "string" ||
    typeof type !== "string"
  ) {
    return res.status(400).send({ message: "Query parameters are not strings" });
  }

  next();
}