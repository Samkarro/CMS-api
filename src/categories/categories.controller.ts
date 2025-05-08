import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryApiDto } from '../common/dtos/resources/categories/swagger/CreateCategoryApiDto.dto';
import { Category } from './entities/categories.entity';
import { I18nLang } from 'nestjs-i18n';

@Public()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiResponse({ status: 200, description: 'Listed all existing categories.' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no categories in database.',
  })
  @Get()
  async list(@I18nLang() lang: string): Promise<Category[]> {
    return this.categoriesService.list(lang);
  }

  @ApiResponse({ status: 201, description: 'Created new category.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict, category already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Database query failed.',
  })
  @ApiBody({
    type: CreateCategoryApiDto,
    description:
      'Creating a category requires only the categoryName to be passed in the JSON, as the object only has that and the auto-incrementing id.',
  })
  @Post()
  async create(@Body('categoryName') categoryName: string) {
    return this.categoriesService.create(categoryName);
  }

  @ApiResponse({ status: 200, description: 'Deleted category with given id' })
  @ApiResponse({
    status: 404,
    description: "Not found, couldn't find category with given id in database",
  })
  @Delete(':id')
  async delete(@Param('id') id: number, @I18nLang() lang: string) {
    return this.categoriesService.delete(id, lang);
  }
}
