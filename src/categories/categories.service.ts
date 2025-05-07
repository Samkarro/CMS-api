import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepostiory: Repository<Category>,
    private readonly i18n: I18nService,
  ) {}

  async list() {
    const categoryList = await this.categoriesRepostiory.find();
    if (!categoryList) {
      throw new NotFoundException(
        this.i18n.t('test.CATEGORY.NONE_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return categoryList;
  }

  create(categoryName: string): Promise<Category> {
    const newCategory = this.categoriesRepostiory.create({ categoryName });
    return this.categoriesRepostiory.save(newCategory);
  }

  async delete(id: number): Promise<void> {
    const category = await this.categoriesRepostiory.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(
        this.i18n.t('test.CATEGORY.NOT_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    await this.categoriesRepostiory.delete(id);
  }
}
