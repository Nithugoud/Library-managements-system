import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiBook, FiCalendar, FiUser, FiCheck } from 'react-icons/fi'
import api from '../lib/api'

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
  user: {
    id: string
    name: string
    email: string
  }
}

export default function BorrowedBooks() {
  const queryClient = useQueryClient()

  const { data: borrowedBooks = [], isLoading } = useQuery({
    queryKey: ['borrowed-books'],
    queryFn: async () => {
      const response = await api.get('/borrowed-books')
      return response.data
    }
  })

  const returnMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/borrowed-books/${id}/return`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowed-books'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book returned successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return book')
    }
  })

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Borrowed Books</h1>
        <p className="text-gray-600 mt-1">View all borrowed books across the library</p>
      </div>

      {/* Borrowed Books List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : borrowedBooks.length === 0 ? (
        <div className="card text-center py-12">
          <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No borrowed books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {borrowedBooks.map((borrowed: BorrowedBook) => (
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
                        <FiUser className="text-gray-400" />
                        <span className="font-medium">Borrower</span>
                      </div>
                      <p className="text-gray-900">{borrowed.user.name}</p>
                      <p className="text-gray-500 text-xs">{borrowed.user.email}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <FiCalendar className="text-gray-400" />
                        <span className="font-medium">Borrowed Date</span>
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
                  </div>

                  {borrowed.returnDate && (
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">Returned on: </span>
                      <span className="text-gray-900 font-medium">
                        {new Date(borrowed.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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
                      <FiCheck className="inline mr-1" />
                      Mark Returned
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
