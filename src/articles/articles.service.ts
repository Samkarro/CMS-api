import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { AuthService } from 'src/auth/auth.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  async list(): Promise<Article[]> {
    const articleList = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'user')
      .select([
        'article.id',
        'article.title',
        'article.body',
        'user.username',
        'category.categoryName',
      ])
      .getMany();
    if (!articleList) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NONE_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return articleList;
  }

  async create(
    title: string,
    author: {
      email: string;
      password: string;
    },
    categoryNames: string[],
    body,
  ): Promise<Article> {
    const articleCategories: Category[] = [];

    if (categoryNames) {
      for (const name of categoryNames) {
        let category = await this.categoriesRepository.findOneBy({
          categoryName: name,
        });

        if (!category) {
          category = this.categoriesRepository.create({ categoryName: name });
          await this.categoriesRepository.save(category);
        }

        articleCategories.push(category);
      }
    }
    const validAuthor = await this.authService.validateUser(
      author.email,
      author.password,
    );

    const newArticle = this.articlesRepository.create({
      title,
      author: validAuthor,
      categories: articleCategories,
      body,
    });

    return await this.articlesRepository.save(newArticle);
  }

  async findById(id): Promise<Article> {
    const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'user')
      .select([
        'article.id',
        'article.title',
        'article.body',
        'user.username',
        'category.categoryName',
      ])
      .where('article.id = :id', { id })
      .getOne();
    if (!article) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NOT_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return article;
  }

  async delete(id) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NOT_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    this.articlesRepository.delete(id);
  }

  async update(body, id): Promise<Article> {
    const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'user')
      .select([
        'article.id',
        'article.title',
        'article.body',
        'user.username',
        'user.password',
        'category.categoryName',
      ])
      .where('article.id = :id', { id })
      .getOne();

    if (!article) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NOT_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    if (!body.user) {
      throw new UnauthorizedException(
        this.i18n.t('test.ARTICLE.UNAUTHORIZED', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const user = await this.authService.findOneByEmail(body.user.email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.USER_NOT_FOUND', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    if (body.user.email !== user.email) {
      throw new ForbiddenException(
        this.i18n.t('test.ARTICLE.CANNOT_EDIT_USER', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    this.authService.validateUser(body.user.email, body.user.password);

    const updatedArticle = this.articlesRepository.create({
      ...article,
      ...body,
      author: user,
    });

    await this.articlesRepository.save(updatedArticle);
    return await await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'user')
      .select([
        'article.id',
        'article.title',
        'article.body',
        'user.username',
        'category.categoryName',
      ])
      .where('article.id = :id', { id })
      .getOne();
  }
}
