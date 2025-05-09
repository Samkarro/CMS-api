import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateArticleApiDto {
  title: string;

  @IsNotEmpty()
  user: {
    email: string;
    password: string;
  };

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
