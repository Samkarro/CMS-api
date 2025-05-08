import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterRequestDto } from '../common/dtos/register-request.dto';
import { RegisterResponseDto } from '../common/dtos/register-response.dto';
import { LoginResponseDto } from '../common/dtos/login-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterUserApiDto } from '../common/dtos/resources/users/swagger/RegisterUserDto.dto';
import { LoginUserApiDto } from '../common/dtos/resources/users/swagger/LoginUserApiDto.dto';
import { I18nLang } from 'nestjs-i18n';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: "User created and its new JWT token's returned",
  })
  @ApiResponse({ status: 400, description: 'Bad request, user already exists' })
  @ApiResponse({
    status: 409,
    description: 'Conflict, Username already exists',
  })
  @ApiBody({
    type: RegisterUserApiDto,
    description:
      'Registering a user requires all the same things. A unique username, unique email and a password with at least 6 and at most 50 characters.',
  })
  async register(
    @Body() registerBody: RegisterRequestDto,
    @I18nLang() lang: string,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerBody, lang);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Logged in. Created and returned new JWT token',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login failed' })
  @ApiResponse({
    status: 404,
    description: "Not found, user with given email doesn't exist",
  })
  @ApiBody({
    type: LoginUserApiDto,
    description: 'Logging in only requires an existing email and password.',
  })
  async login(
    @Request() req,
    @I18nLang() lang: string,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.body.user, lang);
  }
}
