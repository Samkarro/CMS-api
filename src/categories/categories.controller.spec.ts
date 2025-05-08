import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/categories.entity';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    categoriesController = await module.get(CategoriesController);
    categoriesService = await module.get(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [{ id: 9, categoryName: 'test' }];
      //jest.spyOn(categoriesService, 'list').mockImplementation(() => result);

      expect(await categoriesController.list()).toBe(result);
    });
  });
});
