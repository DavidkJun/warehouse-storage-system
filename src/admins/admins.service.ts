import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { encodePassword } from 'src/utils/bcrypt';
import { Prisma } from '@prisma/client';
import { prepareUpdateData } from 'src/utils/prepareUpdate';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async findAdminById(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findAdminByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async createAdmin(data: CreateAdminDto) {
    try {
      const hashedPass = await encodePassword(data.password);

      return await this.prisma.admin.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPass,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findAdminById(id);
    if (!admin) throw new NotFoundException('Admin not found');

    const dataForUpdate = prepareUpdateData(updateAdminDto, ['password']);
    return this.prisma.admin.update({
      where: { id: id },
      data: dataForUpdate,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async remove(id: number) {
    await this.findAdminById(id);
    return this.prisma.admin.delete({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }
}
