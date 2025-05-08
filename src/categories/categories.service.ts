import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private readonly i18n: I18nService,
  ) {}

  async list(lang: string) {
    const categoryList = await this.categoriesRepository.find();
    if (!categoryList) {
      throw new NotFoundException(
        this.i18n.t('test.CATEGORY.NONE_FOUND', {
          lang,
        }),
      );
    }
    return categoryList;
  }

  create(categoryName: string): Promise<Category> {
    const newCategory = this.categoriesRepository.create({ categoryName });
    return this.categoriesRepository.save(newCategory);
  }

  async delete(id: number, lang?: string): Promise<void> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(
        this.i18n.t('test.CATEGORY.NOT_FOUND  ', {
          lang,
        }),
      );
    }
    await this.categoriesRepository.delete(id);
  }
}
