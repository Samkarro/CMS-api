import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { UsersService } from 'src/users/users.service';
import { Article } from './atricles.entity';

@Controller('articles')
export class ArticlesController {
  constructor(
    private usersService: UsersService,
    private articlesService: ArticlesService,
  ) {}

  @Get()
  async list(): Promise<Article[]> {
    return this.articlesService.list();
  }

  @Post()
  async create(@Request() req, @Body() body) {
    const user = await this.usersService.findById(req.user.userId);
    return this.articlesService.create(body.title, user, body.categories);
  }

  // @Get(':id')
  // async findByID(@Param('id') id: number): Promise<any> {
  //   return this.articlesService.findById(id);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: number): Promise<any> {
  //   return this.articlesService.delete(id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: number): Promise<any> {
  //   return this.articlesService.update(id);
  // }
}
