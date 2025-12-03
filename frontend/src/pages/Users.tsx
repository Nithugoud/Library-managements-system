import { useQuery } from '@tanstack/react-query'
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi'
import api from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count?: {
    borrowedBooks: number
  }
}

export default function Users() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Users</h1>
        <p className="text-gray-600 mt-1">View all library members</p>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center py-12">
          <FiUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: User) => (
            <div key={user.id} className="card hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="text-gray-400" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user._count && (
                  <div className="pt-2 border-t mt-2">
                    <span className="font-medium text-gray-900">
                      {user._count.borrowedBooks} active borrows
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
