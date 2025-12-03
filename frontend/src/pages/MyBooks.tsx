import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiBook, FiCalendar, FiPlus, FiX } from 'react-icons/fi'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

interface Book {
  id: string
  title: string
  isbn: string
  genre: string
  availableCopies: number
  author: {
    name: string
  }
}

interface BorrowedBook {
  id: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: string
  book: {
    id: string
    title: string
    isbn: string
    author: {
      name: string
    }
  }
}

export default function MyBooks() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: myBorrowedBooks = [], isLoading: isLoadingBorrowed } = useQuery({
    queryKey: ['my-borrowed-books', user?.id],
    queryFn: async () => {
      const response = await api.get(`/borrowed-books/user/${user?.id}`)
      return response.data
    },
    enabled: !!user?.id
  })

  const { data: availableBooks = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['available-books', searchTerm],
    queryFn: async () => {
      const params = searchTerm ? { search: searchTerm, limit: 100 } : { limit: 100 }
      const response = await api.get('/books', { params })
      const books = response.data.data || response.data
      return books.filter((book: Book) => book.availableCopies > 0)
    },
    enabled: isModalOpen
  })

  const borrowMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14) // 2 weeks from now
      const response = await api.post('/borrowed-books/borrow', {
        bookId,
        userId: user?.id,
        dueDate: dueDate.toISOString()
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-borrowed-books'] })
      queryClient.invalidateQueries({ queryKey: ['available-books'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book borrowed successfully!')
      setIsModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to borrow book')
    }
  })

  const returnMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/borrowed-books/${id}/return`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-borrowed-books'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book returned successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return book')
    }
  })

  const handleBorrow = (bookId: string) => {
    borrowMutation.mutate(bookId)
  }

  const handleReturn = (id: string, bookTitle: string) => {
    if (window.confirm(`Mark "${bookTitle}" as returned?`)) {
      returnMutation.mutate(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return 'bg-yellow-100 text-yellow-700'
      case 'RETURNED':
        return 'bg-green-100 text-green-700'
      case 'OVERDUE':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const activeBorrows = myBorrowedBooks.filter((b: BorrowedBook) => b.status === 'BORROWED')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Books</h1>
          <p className="text-gray-600 mt-1">Your borrowed books and reading history</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <FiPlus className="inline mr-2" />
          Borrow Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl font-bold mb-2">{activeBorrows.length}</div>
          <div className="text-blue-100">Currently Borrowed</div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl font-bold mb-2">
            {myBorrowedBooks.filter((b: BorrowedBook) => b.status === 'RETURNED').length}
          </div>
          <div className="text-green-100">Returned Books</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl font-bold mb-2">{myBorrowedBooks.length}</div>
          <div className="text-purple-100">Total Borrowed</div>
        </div>
      </div>

      {/* My Borrowed Books */}
      {isLoadingBorrowed ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : myBorrowedBooks.length === 0 ? (
        <div className="card text-center py-12">
          <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">You haven't borrowed any books yet</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myBorrowedBooks.map((borrowed: BorrowedBook) => (
            <div key={borrowed.id} className="card hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{borrowed.book.title}</h3>
                      <p className="text-sm text-gray-600">by {borrowed.book.author.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <FiCalendar className="text-gray-400" />
                        <span className="font-medium">Borrowed</span>
                      </div>
                      <p className="text-gray-900">
                        {new Date(borrowed.borrowDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <FiCalendar className="text-gray-400" />
                        <span className="font-medium">Due Date</span>
                      </div>
                      <p className="text-gray-900">
                        {new Date(borrowed.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    {borrowed.returnDate && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <FiCalendar className="text-gray-400" />
                          <span className="font-medium">Returned</span>
                        </div>
                        <p className="text-gray-900">
                          {new Date(borrowed.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(borrowed.status)}`}>
                    {borrowed.status}
                  </span>

                  {borrowed.status === 'BORROWED' && (
                    <button
                      onClick={() => handleReturn(borrowed.id, borrowed.book.title)}
                      className="btn-primary text-sm"
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Borrow Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-4xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="text-2xl font-bold gradient-text">Borrow a Book</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Available Books */}
            {isLoadingBooks ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : availableBooks.length === 0 ? (
              <div className="text-center py-12">
                <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500">No available books found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableBooks.map((book: Book) => (
                  <div key={book.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author.name}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600">Genre: {book.genre}</span>
                      <span className="text-green-600 font-medium">
                        {book.availableCopies} available
                      </span>
                    </div>
                    <button
                      onClick={() => handleBorrow(book.id)}
                      className="btn-primary w-full text-sm"
                      disabled={borrowMutation.isPending}
                    >
                      Borrow (Due in 14 days)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
