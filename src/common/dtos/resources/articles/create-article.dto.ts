export class CreateArticleDto {
  title: string;
  author: {
    email: string;
    password: string;
  };
  categories: [string];
  body: string;
}
