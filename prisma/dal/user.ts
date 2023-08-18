import { PrismaClient, User } from "@prisma/client";

class UserDAL {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(email: string, password: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });
  }

  async updateUser(id: number, email: string, password: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        password: password,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}