import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { User } from 'src/users/entities/users.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { AuthService } from 'src/auth/auth.service';

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
    // TODO: Add re-validation for user, make them log in again
    title: string,
    author: {
      email;
      password;
    },
    categoryNames: string[],
  ): Promise<Article> {
    const articleCategories: Category[] = [];

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

    const newArticle = this.articlesRepository.create({
      title,
      author,
      categories: articleCategories,
    });

    return await this.articlesRepository.save(newArticle);
  }

  async findById(id): Promise<Article> {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('User not found');
    }
    return article;
  }

  async delete(id) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('User not found');
    }
    this.articlesRepository.delete(id);
  }

  async update(body, id): Promise<Article> {
    // TODO: also do it here
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('User not found');
    }
    this.articlesRepository.update(id, body);
    return this.articlesRepository.findOneBy({ id });
  }
}
