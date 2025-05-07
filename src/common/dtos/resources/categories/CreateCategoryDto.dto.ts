import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Politics',
    required: true,
  })
  @IsNotEmpty()
  categoryName: string;
}
