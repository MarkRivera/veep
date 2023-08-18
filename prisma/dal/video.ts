import { PrismaClient, User, Video } from '@prisma/client';

class VideoDAL {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getVideoById(id: number): Promise<Video | null> {
    return await this.prisma.video.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createVideo(title: string, userId: number, url: string): Promise<Video> {
    return await this.prisma.video.create({
      data: {
        title,
        url,
        userId
      },
    });
  }

  async updateVideo(id: number, title: string, url: string): Promise<Video> {
    return await this.prisma.video.update({
      where: {
        id: id,
      },
      data: {
        title,
        url
      },
    });
  }

  async deleteVideo(id: number): Promise<Video> {
    return await this.prisma.video.delete({
      where: {
        id: id,
      },
    });
  }
}