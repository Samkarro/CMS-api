import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepostiory: Repository<Category>,
  ) {}

  async list() {
    const categoryList = await this.categoriesRepostiory.find();
    if (!categoryList) {
      throw new NotFoundException('No categories in database');
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
      throw new NotFoundException('No categories in database');
    }
    await this.categoriesRepostiory.delete(id);
  }
}
