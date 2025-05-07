import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/articles.entity';
import { User } from 'src/users/entities/users.entity';
import { Category } from 'src/categories/entities/categories.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
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
      throw new NotFoundException('No articles found in database');
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
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async delete(id) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    this.articlesRepository.delete(id);
  }

  async update(body, id): Promise<Article> {
    // TODO: also do it here
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
      throw new NotFoundException('Article not found');
    }
    if (!body.user) {
      throw new ForbiddenException('User not specified');
    }
    const user = await this.authService.findOneByEmail(body.user.email);
    if (!user) {
      throw new NotFoundException('Passed user not found');
    }
    if (body.user.email !== user.email) {
      throw new BadRequestException('Cannot edit user');
    }
    this.authService.validateUser(body.user.email, body.user.password);

    const updatedArticle = this.articlesRepository.create({
      ...article,
      ...body,
      author: user, // Ensure the author is assigned correctly
    });

    await this.articlesRepository.save(updatedArticle);
    return await this.articlesRepository.findOneBy({ id });
  }
}
