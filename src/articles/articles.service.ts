import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { Category } from '../categories/entities/categories.entity';
import { AuthService } from '../auth/auth.service';
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

  async list(lang: string): Promise<Article[]> {
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
          lang,
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
    lang: string,
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
      lang,
    );

    const newArticle = this.articlesRepository.create({
      title,
      author: validAuthor,
      categories: articleCategories,
      body,
    });

    return await this.articlesRepository.save(newArticle);
  }

  async findById(id, lang): Promise<Article> {
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
          lang,
        }),
      );
    }
    return article;
  }

  async delete(id, lang) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NOT_FOUND', {
          lang,
        }),
      );
    }
    this.articlesRepository.delete(id);
  }

  async update(body, id, lang): Promise<Article> {
    const article = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .leftJoinAndSelect('article.author', 'user')
      .select([
        'article.id',
        'article.title',
        'article.body',
        'user.username',
        'user.email',
        'user.password',
        'category.categoryName',
      ])
      .where('article.id = :id', { id })
      .getOne();

    if (!article) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.NOT_FOUND', {
          lang,
        }),
      );
    }
    if (!body.author) {
      throw new UnauthorizedException(
        this.i18n.t('test.ARTICLE.UNAUTHORIZED', {
          lang,
        }),
      );
    }
    const user = await this.authService.findOneByEmail(body.author.email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('test.ARTICLE.USER_NOT_FOUND', {
          lang,
        }),
      );
    }
    if (body.author.email !== article.author.email) {
      throw new ForbiddenException(
        this.i18n.t('test.ARTICLE.CANNOT_EDIT_USER', {
          lang,
        }),
      );
    }
    this.authService.validateUser(
      body.author.email,
      body.author.password,
      lang,
    );

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
