import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserApiDto {
  @ApiProperty({
    example: 'RomanticHawking',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'romanceScience@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'fnwebofg73297',
    required: true,
  })
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
