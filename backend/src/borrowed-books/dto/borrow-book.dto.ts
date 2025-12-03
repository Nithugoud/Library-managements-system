import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class BorrowBookDto {
  @ApiProperty({ example: 'user-uuid-here' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'book-uuid-here' })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ 
    example: '2024-12-17',
    description: 'Due date for returning the book' 
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;
}
