import { Injectable } from '@nestjs/common';
import { Article } from 'src/common/interfaces/articles.interface';

@Injectable() // FIXME: Create actual endpoints with database connections
export class ArticlesService {
  private readonly articles: Article[] = [];

  create(article: Article) {
    this.articles.push(article);
  }

  list(): Article[] {
    return this.articles;
  }

  findById(id): any {
    try {
      return this.articles[id];
    } catch (err) {
      return err;
    }
  }

  delete(id): any {
    try {
      this.articles.splice(id, 1);
    } catch (err) {
      return err;
    }
  }

  update(id): string {
    return `I update by ${id}, I have not yet been created`;
  }
}
