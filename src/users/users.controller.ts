import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterRequestDto } from 'src/common/dtos/register-request.dto';
import { RegisterResponseDto } from 'src/common/dtos/register-response.dto';
import { LoginResponseDto } from 'src/common/dtos/login-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterUserApiDto } from 'src/common/dtos/resources/categories/RegisterUserDto.dto';
import { LoginUserApiDto } from 'src/common/dtos/resources/users/LoginUserApiDto.dto';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User has been created and its new ',
  })
  @ApiResponse({ status: 400, description: 'Bad request, user already exists' })
  @ApiResponse({
    status: 409,
    description: 'Conflict, Username already exists',
  })
  @ApiBody({
    type: RegisterUserApiDto,
    description: 'Json structure for registration',
  })
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerBody);
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
    description: 'Json structure for login',
  })
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.body.user);
  }
}
