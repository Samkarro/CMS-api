import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepostiory: Repository<Category>,
  ) {}

  list() {
    return this.categoriesRepostiory.find();
  }

  create(categoryName: string): Promise<Category> {
    const newCategory = this.categoriesRepostiory.create({ categoryName });
    return this.categoriesRepostiory.save(newCategory);
  }

  async delete(id: number): Promise<void> {
    await this.categoriesRepostiory.delete(id);
  }
}
