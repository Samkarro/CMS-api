import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QueryFilter } from 'src/common/exceptions/queries.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseFilters(QueryFilter)
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}
