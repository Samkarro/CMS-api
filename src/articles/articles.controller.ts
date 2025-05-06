import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseFilters,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { UsersService } from 'src/users/users.service';
import { QueryExceptionFilter } from 'src/common/exceptions/queries.exception';

@Controller('articles')
export class ArticlesController {
  constructor(
    private usersService: UsersService,
    private articlesService: ArticlesService,
  ) {}

  @Get()
  async list() {
    return this.articlesService.list();
  }

  @Post()
  @UseFilters(QueryExceptionFilter)
  async create(@Request() req, @Body() body) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    return this.articlesService.create(body.title, user, body.categories);
  }

  @Get(':id')
  async findByID(@Param('id') id: number) {
    return this.articlesService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.articlesService.delete(id);
  }

  @Patch(':id')
  @UseFilters(QueryExceptionFilter)
  async update(@Body() body, @Param('id') id: number): Promise<any> {
    return this.articlesService.update(body, id);
  }
}
