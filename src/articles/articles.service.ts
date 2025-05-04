import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './atricles.entity';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';

@Injectable() // FIXME: Create actual endpoints with database connections
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

  // findById(id): any {
  //   try {
  //     return this.articles[id];
  //   } catch (err) {
  //     return err;
  //   }
  // }

  // delete(id): any {
  //   try {
  //     this.articles.splice(id, 1);
  //   } catch (err) {
  //     return err;
  //   }
  // }

  // update(id): string {
  //   return `I update by ${id}, I have not yet been created`;
  // }
}
