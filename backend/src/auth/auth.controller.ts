import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }
    return this.authService.register(name, email, password);
  }
}

