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
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/common/dtos/resources/categories/CreateCategoryDto.dto';

@Public()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiResponse({ status: 200, description: 'Lists all existing categories.' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no categories in database.',
  })
  @Get()
  async list() {
    return this.categoriesService.list();
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
    type: CreateCategoryDto,
    description: 'Json structure for creating new category.',
  })
  @Post()
  async create(@Body('categoryName') categoryName: string) {
    return this.categoriesService.create(categoryName);
  }

  @ApiResponse({ status: 200, description: 'Deletion successful' })
  @ApiResponse({
    status: 404,
    description: "Not found, couldn't find category with given id in database",
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }
}
