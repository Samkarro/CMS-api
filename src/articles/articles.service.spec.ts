import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/articles.entity';
import { Category } from '../categories/entities/categories.entity';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from '../auth/auth.service';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockArticlesRepository = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockCategoriesRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticlesRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('list => Returns all articles as an array', async () => {
    const article = {
      id: Date.now(),
      title: 'Pineapple on Pizza',
      author: {
        username: 'John Marinade',
      },
      categories: ['Politics'],
      body: 'Thorough description of why some consider it an abomination',
    };
    const articles = [article];
    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      leftJoinAndSelect: () => createQueryBuilder,
      getMany: () => articles,
    };

    jest
      .spyOn(mockArticlesRepository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const result = await service.list('en');
    expect(result).toEqual(articles);
  });
});
