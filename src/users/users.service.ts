import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto, UserResponseDto } from '../common/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.mapToResponseDto(user);
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      timezone: user.timezone,
      emailEnabled: user.emailEnabled,
      quietHoursStart: user.quietHoursStart,
      quietHoursEnd: user.quietHoursEnd,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
