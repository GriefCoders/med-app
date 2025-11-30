import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const site = await this.prisma.site.findUnique({
      where: { id: dto.siteId },
    });

    if (!site) {
      throw new NotFoundException('Отделение не найдено');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    const user = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      siteId: dto.siteId,
      roomNumber: dto.roomNumber,
    });

    return {
      ...user,
      password: undefined,
    };
  }

  async search(query: string) {
    const users = await this.userRepository.search(query);

    return users.map((user) => ({
      ...user,
      password: undefined,
    }));
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (dto.email && dto.email !== user.email) {
      const existingByEmail = await this.userRepository.findOneByEmail(
        dto.email,
      );

      if (existingByEmail) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
    }

    if (dto.siteId && dto.siteId !== user.siteId) {
      const site = await this.prisma.site.findUnique({
        where: { id: dto.siteId },
      });

      if (!site) {
        throw new NotFoundException('Отделение не найдено');
      }
    }

    let hashedPassword: string | undefined;
    if (dto.password) {
      hashedPassword = await this.passwordService.hashPassword(dto.password);
    }

    const updatedUser = await this.userRepository.update(id, {
      fullName: dto.fullName ?? undefined,
      email: dto.email ?? undefined,
      password: hashedPassword,
      role: dto.role ?? undefined,
      siteId: dto.siteId ?? undefined,
      roomNumber: dto.roomNumber ?? undefined,
    });

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async delete(id: string) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.userRepository.delete(id);
  }
}
