import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: createAuthorDto,
    });
  }

  async findAll() {
    return this.prisma.author.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            isbn: true,
            genre: true,
            coverImage: true,
            availableCopies: true,
            totalCopies: true,
          },
        },
      },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  async remove(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    await this.prisma.author.delete({
      where: { id },
    });

    return { message: 'Author deleted successfully' };
  }
}
