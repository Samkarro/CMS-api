import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, Length } from 'class-validator';

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
}
