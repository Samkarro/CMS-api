import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { User } from 'src/users/entities/users.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { AuthService } from 'src/auth/auth.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private authService: AuthService,
  ) {}

  list() {
    const articleList = this.articlesRepository.find();
    if (!articleList) {
      throw new NotFoundException('No articles found in database');
    }
    return articleList;
  }

  async create(
    title: string,
    author: {
      email: string;
      password: string;
    },
    categoryNames: string[],
    body,
  ): Promise<Article> {
    const articleCategories: Category[] = [];

    if (categoryNames) {
      for (const name of categoryNames) {
        let category = await this.categoriesRepository.findOneBy({
          categoryName: name,
        });

        if (!category) {
          category = this.categoriesRepository.create({ categoryName: name });
          await this.categoriesRepository.save(category);
        }

        articleCategories.push(category);
      }
    }
    const validAuthor = await this.authService.validateUser(
      author.email,
      author.password,
    );

    const newArticle = this.articlesRepository.create({
      title,
      author: validAuthor,
      categories: articleCategories,
      body,
    });

    return await this.articlesRepository.save(newArticle);
  }

  async findById(id): Promise<Article> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async delete(id) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    this.articlesRepository.delete(id);
  }

  async update(body, id): Promise<Article> {
    // TODO: also do it here
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    this.articlesRepository.update(id, body);
    return this.articlesRepository.findOneBy({ id });
  }
}
