import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { Article } from './entities/articles.entity';
import { User } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, User]),
    UsersModule,
    AuthModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
