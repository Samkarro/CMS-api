export type CreateArticleDto = {
  title: string;
  author: {
    email: string;
    password: string;
  };
  categories: [string];
  body: string;
};
