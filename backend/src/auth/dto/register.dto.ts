import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum AgeCategory {
  TEEN_YOUTH = 'TEEN_YOUTH',
  YOUNG_ADULT = 'YOUNG_ADULT', 
  ADULT = 'ADULT',
  SENIOR = 'SENIOR'
}

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(AgeCategory)
  ageCategory?: AgeCategory;
}