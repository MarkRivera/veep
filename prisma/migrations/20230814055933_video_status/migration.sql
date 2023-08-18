-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('ENQUEUED', 'PROCESSING', 'READY', 'ERROR', 'SUCCESS');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "status" "VideoStatus" NOT NULL DEFAULT 'ENQUEUED';
