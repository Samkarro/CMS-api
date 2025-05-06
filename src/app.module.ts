import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, // test
    ArticlesModule,
    CategoriesModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '../src/i18n/'),
          watch: true,
        },
        //      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      }),
      resolvers: [new QueryResolver(['en', 'ka'])],
    }),
  ],
  controllers: [AppController], // ste
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
