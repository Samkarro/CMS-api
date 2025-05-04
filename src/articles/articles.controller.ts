import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/common/interfaces/articles.interface';
import { CreateArticleDto } from 'src/common/dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async list(): Promise<Article[]> {
    return this.articlesService.list();
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get(':id')
  async findByID(@Param('id') id: number): Promise<any> {
    return this.articlesService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return this.articlesService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number): Promise<any> {
    return this.articlesService.update(id);
  }
}
