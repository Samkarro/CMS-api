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
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async list() {
    return await this.articlesService.list();
  }

  @Post()
  @UseFilters(QueryExceptionFilter)
  async create(@Body() body) {
    return await this.articlesService.create(
      body.title,
      body.user,
      body.categories,
      body.body,
    );
  }

  @Get(':id')
  async findByID(@Param('id') id: number) {
    return await this.articlesService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.articlesService.delete(id);
  }

  @Patch(':id')
  @UseFilters(QueryExceptionFilter)
  async update(@Body() body, @Param('id') id: number): Promise<any> {
    return await this.articlesService.update(body, id);
  }
}
