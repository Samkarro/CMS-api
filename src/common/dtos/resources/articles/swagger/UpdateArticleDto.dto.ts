import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateArticleApiDto {
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: {
      email: 'romanceScience@gmail.com',
      password: 'fnwebofg73297',
    },
  })
  author: {
    email: string;
    password: string;
  };

  @IsNotEmpty()
  @ApiProperty({
    example: ['Politics', 'Lifestyle', 'Mischief'],
    required: false,
  })
  categories: string[];

  @ApiProperty({
    example:
      'This post has been successfully vandalized by the anti-pinepple on pizza gang',
    required: false,
  })
  body: string;
}
