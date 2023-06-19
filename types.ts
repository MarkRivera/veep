export type RedisTask = {
  chunkName: string,
  chunkNumber: number,
  filename: string,
  data: string,
  totalChunks: number
}