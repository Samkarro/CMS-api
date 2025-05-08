import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from 'src/common/dtos/resources/categories/CreateCategoryDto.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategoriesRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn().mockImplementation((key: string) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list => Should return an array of categories', async () => {
    // Arrange
    const category = {
      id: Date.now(),
      categoryName: 'Board Games',
    };
    const categories = [category];
    jest.spyOn(mockCategoriesRepository, 'find').mockReturnValue(categories);

    // Act
    const result = await service.list('en');

    // Assert
    expect(result).toEqual(categories);
    expect(mockCategoriesRepository.find).toHaveBeenCalled();
  });

  it('create => Should create a new category and return its data', async () => {
    // Arrange
    const createCategoryDto = {
      categoryName: 'Board Games',
    } as CreateCategoryDto;

    const category = {
      categoryName: 'Board Games',
    } as Category;

    jest.spyOn(mockCategoriesRepository, 'save').mockReturnValue(category);

    // Act
    const result = await service.create(createCategoryDto.categoryName);

    // Assert
    expect(mockCategoriesRepository.save).toHaveBeenCalled();
    expect(mockCategoriesRepository.create).toHaveBeenCalledWith(
      createCategoryDto,
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

    jest.spyOn(mockCategoriesRepository, 'findOneBy').mockReturnValue(category);

    // Act
    await service.delete(id, 'en');

    // Assert
    expect(mockCategoriesRepository.delete).toHaveBeenCalled();
    expect(mockCategoriesRepository.delete).toHaveBeenCalledWith(id);
  });
});
