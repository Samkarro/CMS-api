import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async list() {
    return this.categoriesService.list();
  }

  @Post()
  async create(@Body('categoryName') categoryName: string) {
    return this.categoriesService.create(categoryName);
  }

  @Delete()
  async delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }
}
