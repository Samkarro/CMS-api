import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { QueryExceptionFilter } from 'src/common/exceptions/queries.exception';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async list() {
    return this.categoriesService.list();
  }

  @Post()
  @UseFilters(QueryExceptionFilter)
  async create(@Body('categoryName') categoryName: string) {
    return this.categoriesService.create(categoryName);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }
}
