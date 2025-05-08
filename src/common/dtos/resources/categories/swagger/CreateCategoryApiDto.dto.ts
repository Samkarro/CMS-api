import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryApiDto {
  @ApiProperty({
    example: 'Politics',
    required: true,
  })
  @IsNotEmpty()
  categoryName: string;
}
