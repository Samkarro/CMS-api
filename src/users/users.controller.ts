import {
  Body,
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QueryExceptionFilter } from 'src/common/exceptions/queries.exception';
import { RegisterRequestDto } from 'src/common/dtos/register-request.dto';
import { RegisterResponseDto } from 'src/common/dtos/register-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto } from 'src/common/dtos/login-response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(QueryExceptionFilter) // Maybe add badrequestexception to return types? TODO:
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerBody);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
