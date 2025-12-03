import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Borrowed Books')
@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book successfully borrowed' })
  @ApiResponse({ status: 404, description: 'User or book not found' })
  @ApiResponse({ status: 400, description: 'Book not available' })
  borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrowBook(borrowBookDto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({ status: 200, description: 'Book successfully returned' })
  @ApiResponse({ status: 404, description: 'Borrowed book record not found' })
  @ApiResponse({ status: 400, description: 'Book already returned' })
  returnBook(@Param('id') id: string) {
    return this.borrowedBooksService.returnBook(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all borrowed books for a user' })
  @ApiResponse({ status: 200, description: 'Return user\'s borrowed books' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findUserBorrowedBooks(@Param('userId') userId: string) {
    return this.borrowedBooksService.findUserBorrowedBooks(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowed books' })
  @ApiResponse({ status: 200, description: 'Return all borrowed books' })
  findAll() {
    return this.borrowedBooksService.findAll();
  }
}
