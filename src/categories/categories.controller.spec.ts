import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from 'src/common/dtos/resources/categories/CreateCategoryDto.dto';
import { Category } from './entities/categories.entity';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;

  const mockCategoriesService = {
    list: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    categoriesController =
      await module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  it('list => Should return an array of categories', async () => {
    // Arrange
    const category = {
      id: Date.now(),
      categoryName: 'Board Games',
    };
    const categories = [category];
    jest.spyOn(mockCategoriesService, 'list').mockReturnValue(categories);

    // Act
    const result = await mockCategoriesService.list('en');

    // Assert
    expect(result).toEqual(categories);
    expect(mockCategoriesService.list).toHaveBeenCalled();
    expect(mockCategoriesService.list).toHaveBeenCalledWith('en');
  });

  it('create => Should create a new category and return its data', async () => {
    // Arrange
    const createCategoryDto = {
      categoryName: 'Board Games',
    } as CreateCategoryDto;

    const category = {
      categoryName: 'Board Games',
    } as Category;

    jest.spyOn(mockCategoriesService, 'create').mockReturnValue(category);

    // Act
    const result = await mockCategoriesService.create(
      createCategoryDto.categoryName,
    );

    // Assert
    expect(mockCategoriesService.create).toHaveBeenCalled();
    expect(mockCategoriesService.create).toHaveBeenCalledWith(
      createCategoryDto.categoryName,
    );

    expect(result).toEqual(category);
  });
  it('delete => Should find user by given id, and delete it', async () => {
    // Arrange
    const id = 34;
    const category = {
      id: 34,
      categoryName: 'Board Games',
    };

    jest.spyOn(mockCategoriesService, 'delete').mockReturnValue(category);

    // Act
    await mockCategoriesService.delete(id, 'en');

    // Assert
    expect(mockCategoriesService.delete).toHaveBeenCalled();
    expect(mockCategoriesService.delete).toHaveBeenCalledWith(id, 'en');
  });
});
