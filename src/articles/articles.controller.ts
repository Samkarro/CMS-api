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
import { QueryExceptionFilter } from '../common/exceptions/queries.exception';
import { Public } from '../common/decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateArticleApiDto } from '../common/dtos/resources/articles/swagger/CreateArticleDto.dto';
import { UpdateArticleApiDto } from '../common/dtos/resources/articles/swagger/UpdateArticleDto.dto';
import { I18nLang } from 'nestjs-i18n';
import { CreateArticleDto } from '../common/dtos/resources/articles/create-article.dto';

@Public()
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listed all articles in the database.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found, no articles in database.',
  })
  async list(@I18nLang() lang: string) {
    return await this.articlesService.list(lang);
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
    type: CreateArticleApiDto,
    description:
      "The article creation JSON has the title, the user's credentials (as we do not have a logged in state), the categories for the article and its body. Please note that the user passed should already exist (email should be in the database) and will be authenticated, password should be valid.",
  })
  @UseFilters(QueryExceptionFilter)
  async create(@Body() body: CreateArticleDto, @I18nLang() lang: string) {
    return await this.articlesService.create(
      body.title,
      body.author,
      body.categories,
      body.body,
      lang,
    );
  }

  @ApiResponse({ status: 200, description: 'Returned article with given id' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no article with given id in database',
  })
  @Get(':id')
  async findByID(@Param('id') id: number, @I18nLang() lang: string) {
    return await this.articlesService.findById(id, lang);
  }

  @ApiResponse({ status: 200, description: 'Deleted article with given id' })
  @ApiResponse({
    status: 404,
    description: 'Not found, no article with given id in database',
  })
  @Delete(':id')
  async delete(@Param('id') id: number, @I18nLang() lang: string) {
    return await this.articlesService.delete(id, lang);
  }

  @ApiResponse({
    status: 200,
    description: 'Updated article and returned it.',
  })
  @ApiResponse({
    status: 401,
    description:
      "Unauthorised. User isn't passed or passed user's password is incorrect.",
  })
  @ApiResponse({
    status: 404,
    description: "Not found, passed user doesn't exist",
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Cannot change author of article',
  })
  @ApiBody({
    type: UpdateArticleApiDto,
    description:
      'Updating an article always requires passing the user that made the article and categories (new or otherwise), all else is optional.',
  })
  @Patch(':id')
  @UseFilters(QueryExceptionFilter)
  async update(
    @Body() body: CreateArticleDto,
    @Param('id') id: number,
    @I18nLang() lang: string,
  ): Promise<any> {
    return await this.articlesService.update(body, id, lang);
  }
}
