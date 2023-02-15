import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async create(options?: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: options?.email || 'johndoe@email.com',
        password: options?.password || 'password',
        name: options?.name || 'John Doe',
        companyName: options?.companyName || 'John Doe Company',
      },
    });
  }
}
