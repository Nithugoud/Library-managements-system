import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiSearch, FiX } from 'react-icons/fi'
import api from '../lib/api'

interface Book {
  id: string
  title: string
  isbn: string
  publishedDate: string
  genre: string
  availableCopies: number
  totalCopies: number
  author: {
    id: string
    name: string
  }
}

interface Author {
  id: string
  name: string
}

interface BookForm {
  title: string
  isbn: string
  publishedDate: string
  genre: string
  totalCopies: number
  authorId: string
}

export default function Books() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    isbn: '',
    publishedDate: '',
    genre: '',
    totalCopies: 1,
    authorId: ''
  })

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', searchTerm],
    queryFn: async () => {
      const params = searchTerm ? { search: searchTerm, limit: 100 } : { limit: 100 }
      const response = await api.get('/books', { params })
      return response.data.data || response.data
    }
  })

  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const response = await api.get('/authors')
      return response.data.data || response.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: BookForm) => {
      const response = await api.post('/books', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book created successfully!')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create book')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BookForm> }) => {
      const response = await api.patch(`/books/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book updated successfully!')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update book')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/books/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete book')
    }
  })

  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book)
      setFormData({
        title: book.title,
        isbn: book.isbn,
        publishedDate: book.publishedDate.split('T')[0],
        genre: book.genre,
        totalCopies: book.totalCopies,
        authorId: book.author.id
      })
    } else {
      setEditingBook(null)
      setFormData({
        title: '',
        isbn: '',
        publishedDate: '',
        genre: '',
        totalCopies: 1,
        authorId: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBook(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Books</h1>
          <p className="text-gray-600 mt-1">Manage your library collection</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus className="inline mr-2" />
          Add Book
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by title, ISBN, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="card text-center py-12">
          <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: Book) => (
            <div key={book.id} className="card hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600">by {book.author.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(book)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ISBN:</span>
                  <span className="font-medium">{book.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Genre:</span>
                  <span className="font-medium">{book.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select an author</option>
                  {authors.map((author: Author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                <input
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Copies</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingBook ? 'Update Book' : 'Create Book'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
