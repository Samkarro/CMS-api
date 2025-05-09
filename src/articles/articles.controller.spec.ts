import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { I18nService } from 'nestjs-i18n';
import { CreateArticleDto } from 'src/common/dtos/resources/articles/create-article.dto';
import { Article } from './entities/articles.entity';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const mockArticlesService = {
    list: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('list => Returns all articles as an array', async () => {
    // Arrange
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

    jest.spyOn(mockArticlesService, 'list').mockReturnValue(articles);

    // Act
    const result = await controller.list('en');

    // Assert
    expect(mockArticlesService.list).toHaveBeenCalled();
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

    jest.spyOn(mockArticlesService, 'create').mockReturnValue(article);

    // Act
    await controller.create(createArticleDto, 'en');

    // Assert
    expect(mockArticlesService.create).toHaveBeenCalled();
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

    jest.spyOn(mockArticlesService, 'findById').mockReturnValue(article);

    // Act
    await controller.delete(id, 'en');

    // Assert
    expect(mockArticlesService.delete).toHaveBeenCalled();
    expect(mockArticlesService.delete).toHaveBeenCalledWith(id, 'en');
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

    jest.spyOn(mockArticlesService, 'findById').mockReturnValue(article);

    const result = await controller.findByID(id, 'en');
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
    } as CreateArticleDto;

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

    jest.spyOn(mockArticlesService, 'update').mockReturnValue(article);

    const result = await controller.update(body, id, 'en');

    expect(mockArticlesService.update).toHaveBeenCalled();
    expect(result).toEqual(article);
  });
});
