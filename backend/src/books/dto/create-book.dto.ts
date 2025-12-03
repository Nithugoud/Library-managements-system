import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min, IsDateString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'Harry Potter and the Philosopher\'s Stone' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '978-0439708180' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ 
    example: 'The first novel in the Harry Potter series',
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: '1997-06-26',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  publishedDate?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalCopies: number;

  @ApiProperty({ 
    example: 'Fantasy',
    required: false 
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ 
    example: 'https://images.unsplash.com/photo-1621351183012-e2f10f14d3e4?w=400',
    required: false 
  })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: 'author-uuid-here' })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
