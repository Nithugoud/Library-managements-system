import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      email: 'admin@library.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Jane Smith',
      role: 'USER',
    },
  });

  // Create authors
  const author1 = await prisma.author.create({
    data: {
      name: 'J.K. Rowling',
      biography: 'British author best known for the Harry Potter series',
      birthDate: new Date('1965-07-31'),
      country: 'United Kingdom',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'George R.R. Martin',
      biography: 'American novelist and short story writer in fantasy, horror, and science fiction',
      birthDate: new Date('1948-09-20'),
      country: 'United States',
    },
  });

  const author3 = await prisma.author.create({
    data: {
      name: 'J.R.R. Tolkien',
      biography: 'English writer, poet, philologist, and university professor',
      birthDate: new Date('1892-01-03'),
      country: 'United Kingdom',
    },
  });

  const author4 = await prisma.author.create({
    data: {
      name: 'Agatha Christie',
      biography: 'English writer known for her detective novels',
      birthDate: new Date('1890-09-15'),
      country: 'United Kingdom',
    },
  });

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '978-0439708180',
      description: 'The first novel in the Harry Potter series',
      publishedDate: new Date('1997-06-26'),
      totalCopies: 5,
      availableCopies: 5,
      genre: 'Fantasy',
      coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f10f14d3e4?w=400',
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'A Game of Thrones',
      isbn: '978-0553103540',
      description: 'The first book in A Song of Ice and Fire series',
      publishedDate: new Date('1996-08-06'),
      totalCopies: 3,
      availableCopies: 3,
      genre: 'Fantasy',
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      authorId: author2.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'The Lord of the Rings',
      isbn: '978-0618640157',
      description: 'An epic high-fantasy novel',
      publishedDate: new Date('1954-07-29'),
      totalCopies: 4,
      availableCopies: 4,
      genre: 'Fantasy',
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      authorId: author3.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Murder on the Orient Express',
      isbn: '978-0062693662',
      description: 'A detective novel featuring Hercule Poirot',
      publishedDate: new Date('1934-01-01'),
      totalCopies: 3,
      availableCopies: 2,
      genre: 'Mystery',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      authorId: author4.id,
    },
  });

  const book5 = await prisma.book.create({
    data: {
      title: 'The Hobbit',
      isbn: '978-0547928227',
      description: 'A children\'s fantasy novel',
      publishedDate: new Date('1937-09-21'),
      totalCopies: 4,
      availableCopies: 3,
      genre: 'Fantasy',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      authorId: author3.id,
    },
  });

  // Create some borrowed books
  await prisma.borrowedBook.create({
    data: {
      userId: user1.id,
      bookId: book4.id,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'BORROWED',
    },
  });

  await prisma.borrowedBook.create({
    data: {
      userId: user1.id,
      bookId: book5.id,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'BORROWED',
    },
  });

  console.log('Seed completed successfully!');
  console.log({
    adminUser,
    user1,
    user2,
    authors: [author1, author2, author3, author4],
    books: [book1, book2, book3, book4, book5],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
