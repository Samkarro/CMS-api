import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Article } from 'src/articles/atricles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true }) // TODO: add email validation
  @IsEmail()
  email: string;

  @Column() // TODO: add length validation
  @Length(6, 50)
  password: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
