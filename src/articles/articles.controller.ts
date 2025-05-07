import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { QueryExceptionFilter } from 'src/common/exceptions/queries.exception';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateArticleDto } from 'src/common/dtos/resources/articles/CreateArticleDto.dto';
import { updateArticleDto } from 'src/common/dtos/resources/articles/UpdateArticleDto.dto';

@Public()
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lists all articles in the database.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found, no articles in database.',
  })
  async list() {
    return await this.articlesService.list();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created new article and returns it.',
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorised. Passed user's password is incorrect.",
  })
  @ApiResponse({
    status: 404,
    description: "Not found, passed user doesn't exist",
  })
  @ApiResponse({
    status: 500,
    description: 'Database query failed, required attributes missing',
  })
  @ApiBody({
    type: CreateArticleDto,
    description:
      'Json body for article creation. Please not that the user passed should already exist and will be authenticated.',
  })
  @UseFilters(QueryExceptionFilter)
  async create(@Body() body) {
    return await this.articlesService.create(
      body.title,
      body.user,
      body.categories,
      body.body,
    );
  }

  @ApiResponse({ status: 200, description: 'Returned article with given id' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no article with given id in database',
  })
  @Get(':id')
  async findByID(@Param('id') id: number) {
    return await this.articlesService.findById(id);
  }

  @ApiResponse({ status: 200, description: 'Deleted article with given id' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no article with given id in database',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.articlesService.delete(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Updated article and returned it.',
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorised. Passed user's password is incorrect.",
  })
  @ApiResponse({
    status: 404,
    description: "Not found, passed user doesn't exist",
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Cannot change author of article',
  })
  @ApiResponse({
    status: 500,
    description: 'Database query failed, passing user is required',
  })
  @ApiBody({
    type: updateArticleDto,
    description:
      'Json body for article creation. Please not that the user passed should already exist and will be authenticated.',
  })
  @Patch(':id')
  @UseFilters(QueryExceptionFilter)
  async update(@Body() body, @Param('id') id: number): Promise<any> {
    return await this.articlesService.update(body, id);
  }
}
