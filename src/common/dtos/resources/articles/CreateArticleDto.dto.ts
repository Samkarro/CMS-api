import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Is Pineapple on Pizza Slowly Entering the Mainsteam?',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: {
      email: 'romanceScience@gmail.com',
      password: 'fnwebofg73297',
    },
    required: true,
  })
  user: {
    email: string;
    password: string;
  };

  @ApiProperty({
    example: ['Politics', 'Lifestyle'],
    required: false,
  })
  categories: string[];

  @ApiProperty({
    example:
      'Some people believe that pineapple on pizza is an abomination, but a growing population of new enthusiasts of Italian quisine would like to disagree',
    required: true,
  })
  body: string;
}
