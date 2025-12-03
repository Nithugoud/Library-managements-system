import { useQuery } from '@tanstack/react-query'
import { FiBook, FiUsers, FiBookOpen, FiUser } from 'react-icons/fi'
import api from '../lib/api'

export default function Dashboard() {
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await api.get('/books')
      return response.data
    },
  })

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const response = await api.get('/authors')
      return response.data
    },
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
  })

  const { data: borrowedBooks } = useQuery({
    queryKey: ['borrowed-books'],
    queryFn: async () => {
      const response = await api.get('/borrowed-books')
      return response.data
    },
  })

  const stats = [
    {
      name: 'Total Books',
      value: books?.meta?.total || books?.data?.length || 0,
      icon: FiBook,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-50 to-cyan-50',
    },
    {
      name: 'Authors',
      value: authors?.length || 0,
      icon: FiUser,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
    },
    {
      name: 'Library Members',
      value: users?.length || 0,
      icon: FiUsers,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-50 to-emerald-50',
    },
    {
      name: 'Books Borrowed',
      value: borrowedBooks?.filter((b: any) => b.status === 'BORROWED')?.length || 0,
      icon: FiBookOpen,
      gradient: 'from-orange-500 to-red-500',
      bg: 'from-orange-50 to-red-50',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your library management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.bg} rounded-2xl`}>
                  <Icon className={`h-8 w-8 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Books */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added Books</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books?.data?.slice(0, 6).map((book: any) => (
            <div key={book.id} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start space-x-3">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/60'}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{book.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{book.author?.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{book.genre}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      book.availableCopies > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.availableCopies > 0 ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
