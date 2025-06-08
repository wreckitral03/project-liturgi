import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AgeCategory } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ageCategory: user.ageCategory, // Add this line
      },
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
    ageCategory?: AgeCategory,
  ) {
    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }
  
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'FREE',
        ageCategory: ageCategory || AgeCategory.YOUNG_ADULT, // Use enum value
      },
    });
  
    return {
      access_token: this.generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ageCategory: user.ageCategory,
      },
    };
  }
}
