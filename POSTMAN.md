# API Testing with Postman

## Setup

1. Import this collection into Postman
2. Create an environment with:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set automatically after login)

## Collection Structure

### 1. Authentication

#### Register User
```
POST {{baseUrl}}/auth/register
Body (JSON):
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

#### Login
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "admin@library.com",
  "password": "admin123"
}

Tests (auto-save token):
pm.environment.set("token", pm.response.json().token);
```

### 2. Books

#### Get All Books
```
GET {{baseUrl}}/books
```

#### Get Books with Filters
```
GET {{baseUrl}}/books?search=Harry&genre=Fantasy&available=true&page=1&limit=10
```

#### Get Book by ID
```
GET {{baseUrl}}/books/{{bookId}}
```

#### Create Book
```
POST {{baseUrl}}/books
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "New Book Title",
  "isbn": "978-1234567890",
  "description": "Book description",
  "publishedDate": "2024-01-01",
  "totalCopies": 5,
  "genre": "Fiction",
  "coverImage": "https://example.com/cover.jpg",
  "authorId": "author-uuid-here"
}
```

#### Update Book
```
PATCH {{baseUrl}}/books/{{bookId}}
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Updated Title",
  "totalCopies": 10
}
```

#### Delete Book
```
DELETE {{baseUrl}}/books/{{bookId}}
Headers:
  Authorization: Bearer {{token}}
```

### 3. Authors

#### Get All Authors
```
GET {{baseUrl}}/authors
```

#### Get Author by ID
```
GET {{baseUrl}}/authors/{{authorId}}
```

#### Create Author
```
POST {{baseUrl}}/authors
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "New Author",
  "biography": "Author biography",
  "birthDate": "1980-01-01",
  "country": "USA"
}
```

#### Update Author
```
PATCH {{baseUrl}}/authors/{{authorId}}
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "Updated Name",
  "biography": "Updated biography"
}
```

#### Delete Author
```
DELETE {{baseUrl}}/authors/{{authorId}}
Headers:
  Authorization: Bearer {{token}}
```

### 4. Users

#### Get All Users
```
GET {{baseUrl}}/users
Headers:
  Authorization: Bearer {{token}}
```

#### Get User by ID
```
GET {{baseUrl}}/users/{{userId}}
Headers:
  Authorization: Bearer {{token}}
```

#### Create User
```
POST {{baseUrl}}/users
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### 5. Borrowed Books

#### Borrow a Book
```
POST {{baseUrl}}/borrowed-books/borrow
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "userId": "user-uuid-here",
  "bookId": "book-uuid-here",
  "dueDate": "2024-12-31"
}
```

#### Return a Book
```
PATCH {{baseUrl}}/borrowed-books/{{borrowedBookId}}/return
Headers:
  Authorization: Bearer {{token}}
```

#### Get User's Borrowed Books
```
GET {{baseUrl}}/borrowed-books/user/{{userId}}
Headers:
  Authorization: Bearer {{token}}
```

#### Get All Borrowed Books
```
GET {{baseUrl}}/borrowed-books
Headers:
  Authorization: Bearer {{token}}
```

## Testing Flow

1. **Login** first to get token
2. **Create an Author**
3. **Create a Book** (use author ID from step 2)
4. **Borrow the Book** (use user ID and book ID)
5. **Return the Book** (use borrowed book ID)

## Sample Data IDs

After seeding, you'll have these users:
- Admin: Look up in response after login
- John Doe: Check users endpoint
- Jane Smith: Check users endpoint

Get author and book IDs from their respective endpoints.

## Tips

- Use Postman environment variables for `baseUrl` and `token`
- Set up a pre-request script to auto-refresh tokens
- Use Tests tab to extract IDs from responses
- Create separate collections for different workflows

Example Test Script:
```javascript
// Save book ID from response
if (pm.response.code === 201) {
    pm.environment.set("bookId", pm.response.json().id);
}
```
