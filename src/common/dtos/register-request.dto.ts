import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6, 50)
  @IsNotEmpty()
  password: string;
}
