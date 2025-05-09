import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/articles.entity';
import { Category } from '../categories/entities/categories.entity';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from '../auth/auth.service';
import { CreateArticleDto } from '../common/dtos/resources/articles/create-article.dto';
import * as bcrypt from 'bcrypt';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockArticlesRepository = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
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

  it('create => Creates new article and returns it', async () => {
    // Arrange
    const createArticleDto = {
      title: 'First Article of the Decade 2',
      author: {
        email: 'email',
        password: 'passwrrdtest',
      },
      categories: ['Fantasy'],
      body: 'This is an article. Never ever to be forgotten, or so it seems. Perchance.',
    } as CreateArticleDto;

    const article = {
      id: Date.now(),
      title: 'First Article of the Decade 2',
      author: {
        id: Date.now(),
        username: 'testuser',
        email: 'testemail@gmail.com',
        password:
          '$2b$10$Kru9OGsivQ82H3ZOQjZzpeL7Ds4/3qVRtMxIyxXGHXs9Mq3VJBTBm',
      },
      categories: [
        {
          id: 34,
          categoryName: 'Fantasy',
        },
      ],
      body: 'This is an article. Never ever to be forgotten, or so it seems. Perchance.',
    } as Article;

    jest.spyOn(mockArticlesRepository, 'create').mockReturnValue(article);

    // Act
    await service.create(
      createArticleDto.title,
      createArticleDto.author,
      createArticleDto.categories,
      createArticleDto.body,
      'en',
    );

    // Assert
    expect(mockArticlesRepository.create).toHaveBeenCalled();
  });

  it('delete => Deletes article with given id', async () => {
    const id = 7;
    const article = {
      id: 7,
      title: 'First Article of the Decade 2',
      author: {
        id: 2,
        username: 'testuser',
        email: 'testemail@gmail.com',
        password:
          '$2b$10$Kru9OGsivQ82H3ZOQjZzpeL7Ds4/3qVRtMxIyxXGHXs9Mq3VJBTBm',
      },
      categories: [
        {
          id: 1,
          categoryName: 'Fantasy',
        },
      ],
      body: 'This is an article. Never ever to be forgotten, or so it seems. Perchance.',
    };

    jest.spyOn(mockArticlesRepository, 'findOneBy').mockReturnValue(article);

    // Act
    await service.delete(id, 'en');

    // Assert
    expect(mockArticlesRepository.delete).toHaveBeenCalled();
    expect(mockArticlesRepository.delete).toHaveBeenCalledWith(id);
  });

  it('findById => Returns an article by id', async () => {
    const id = 7;
    const article = {
      id: 7,
      title: 'Pineapple on Pizza',
      author: {
        username: 'John Marinade',
      },
      categories: [{ id: 1, categoryName: 'Politics' }],
      body: 'Thorough description of why some consider it an abomination',
    };
    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      leftJoinAndSelect: () => createQueryBuilder,
      getOne: () => article,
      where: () => createQueryBuilder,
    };

    jest
      .spyOn(mockArticlesRepository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const result = await service.findById(id, 'en');
    expect(result).toEqual(article);
  });

  it('update => Updates article', async () => {
    const id = 7;
    const body = {
      title: 'First Article of the Decade 3',
      author: {
        email: 'email@gmail.com',
        password: 'passwrrdtest',
      },
    };

    const article = {
      id: 7,
      title: 'First Article of the Decade 3',
      user: {
        username: 'John Marinade',
      },
      categories: [
        {
          id: 1,
          categoryName: 'Fantasy',
        },
      ],
      body: 'Thorough description of why some consider it an abomination',
    };

    const returnedArticleMock = {
      id: 7,
      title: 'Pineapple on Pizza',
      author: {
        id: 2,
        username: 'John Marinade',
        email: 'email@gmail.com',
        password: await bcrypt.hash(body.author.password, 10),
      },
      categories: [
        {
          id: 1,
          categoryName: 'Fantasy',
        },
      ],
      body: 'Thorough description of why some consider it an abomination.',
    };

    const user = {
      email: body.author.email,
      password: bcrypt.hash(body.author.password, 10),
    };

    const createQueryBuilderFirst: any = {
      select: () => createQueryBuilderFirst,
      leftJoinAndSelect: () => createQueryBuilderFirst,
      getOne: () => returnedArticleMock,
      where: () => createQueryBuilderFirst,
    };
    const createQueryBuilderSecond: any = {
      select: () => createQueryBuilderSecond,
      leftJoinAndSelect: () => createQueryBuilderSecond,
      getOne: () => article,
      where: () => createQueryBuilderSecond,
    };

    jest
      .spyOn(mockArticlesRepository, 'createQueryBuilder')
      .mockImplementationOnce(() => createQueryBuilderFirst)
      .mockImplementationOnce(() => createQueryBuilderSecond);
    jest.spyOn(mockAuthService, 'findOneByEmail').mockReturnValue(user);

    const result = await service.update(body, id, 'en');

    expect(mockArticlesRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockArticlesRepository.save).toHaveBeenCalled();
    expect(result).toEqual(article);
  });
});
