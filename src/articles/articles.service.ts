import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { User } from 'src/users/entities/users.entity';
import { Category } from 'src/categories/entities/categories.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  list() {
    return this.articlesRepository.find();
  }

  async create(
    title: string,
    author: User,
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
    return this.articlesRepository.findOneBy({ id });
  }

  async delete(id) {
    this.articlesRepository.delete(id);
  }

  async update(body, id): Promise<Article> {
    this.articlesRepository.update(id, body);
    return this.articlesRepository.findOneBy({ id });
  }
}
