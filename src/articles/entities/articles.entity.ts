import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Category } from '../../categories/entities/categories.entity';
import { User } from '../../users/entities/users.entity';
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

  @ApiProperty({
    example: 'Euleruan Principles',
    required: true,
  })
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
