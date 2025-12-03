import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const { userId, bookId, dueDate } = borrowBookDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if book exists and is available
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('No copies of this book are available');
    }

    // Create borrowed book record and update available copies
    const borrowedBook = await this.prisma.$transaction(async (prisma) => {
      // Decrease available copies
      await prisma.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      });

      // Create borrowed book record
      return prisma.borrowedBook.create({
        data: {
          userId,
          bookId,
          dueDate: new Date(dueDate),
          status: 'BORROWED',
        },
        include: {
          book: {
            include: {
              author: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    return borrowedBook;
  }

  async returnBook(borrowedBookId: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id: borrowedBookId },
      include: {
        book: true,
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed book record not found');
    }

    if (borrowedBook.status === 'RETURNED') {
      throw new BadRequestException('This book has already been returned');
    }

    // Update borrowed book status and increase available copies
    const updatedBorrowedBook = await this.prisma.$transaction(async (prisma) => {
      // Increase available copies
      await prisma.book.update({
        where: { id: borrowedBook.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      });

      // Update borrowed book record
      return prisma.borrowedBook.update({
        where: { id: borrowedBookId },
        data: {
          returnDate: new Date(),
          status: 'RETURNED',
        },
        include: {
          book: {
            include: {
              author: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    return updatedBorrowedBook;
  }

  async findUserBorrowedBooks(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.borrowedBook.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }
}
