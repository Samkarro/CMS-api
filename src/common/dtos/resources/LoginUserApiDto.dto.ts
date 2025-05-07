import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserApiDto {
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
