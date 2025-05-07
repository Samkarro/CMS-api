import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/categories.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @ManyToOne(() => User, (user) => user.articles)
  @IsNotEmpty()
  author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @Column()
  @IsNotEmpty()
  body: string;
}
