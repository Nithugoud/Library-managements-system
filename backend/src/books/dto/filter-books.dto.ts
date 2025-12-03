import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt, Min, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterBooksDto {
  @ApiProperty({ required: false, description: 'Search by title or ISBN' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by author ID' })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ required: false, description: 'Filter by genre' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ required: false, description: 'Filter by availability' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ required: false, description: 'Filter by published date (after)' })
  @IsOptional()
  @IsDateString()
  publishedAfter?: string;

  @ApiProperty({ required: false, description: 'Filter by published date (before)' })
  @IsOptional()
  @IsDateString()
  publishedBefore?: string;

  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
