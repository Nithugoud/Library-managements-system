import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Verify author exists
    const author = await this.prisma.author.findUnique({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new BadRequestException('Author not found');
    }

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availableCopies: createBookDto.totalCopies,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
    });
  }

  async findAll(filterDto: FilterBooksDto) {
    const {
      search,
      authorId,
      genre,
      available,
      publishedAfter,
      publishedBefore,
      page = 1,
      limit = 10,
    } = filterDto;

    const where: any = {};

    // Search by title or ISBN
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by author
    if (authorId) {
      where.authorId = authorId;
    }

    // Filter by genre
    if (genre) {
      where.genre = { contains: genre, mode: 'insensitive' };
    }

    // Filter by availability
    if (available !== undefined) {
      if (available) {
        where.availableCopies = { gt: 0 };
      } else {
        where.availableCopies = 0;
      }
    }

    // Filter by publication date range
    if (publishedAfter || publishedBefore) {
      where.publishedDate = {};
      if (publishedAfter) {
        where.publishedDate.gte = new Date(publishedAfter);
      }
      if (publishedBefore) {
        where.publishedDate.lte = new Date(publishedBefore);
      }
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            biography: true,
            country: true,
          },
        },
        borrowedBooks: {
          where: {
            status: 'BORROWED',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // If authorId is being updated, verify the new author exists
    if (updateBookDto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new BadRequestException('Author not found');
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: 'Book deleted successfully' };
  }
}
