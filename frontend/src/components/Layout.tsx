import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FiBook, FiUsers, FiBookOpen, FiUser, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Books', path: '/books', icon: FiBook },
    { name: 'Authors', path: '/authors', icon: FiUser },
    { name: 'Users', path: '/users', icon: FiUsers },
    { name: 'Borrowed Books', path: '/borrowed-books', icon: FiBookOpen },
    { name: 'My Books', path: '/my-books', icon: FiBookOpen },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-xl">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiBook className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Library</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 flex-1 px-3 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 mx-3">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiBook className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">Library</h1>
                    <p className="text-xs text-gray-500">Management</p>
                  </div>
                </div>
              </div>

              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group flex items-center px-3 py-2 text-base font-medium rounded-lg
                        ${active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`mr-3 h-6 w-6 ${active ? 'text-white' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiBook className="text-white text-lg" />
            </div>
            <h1 className="text-lg font-bold gradient-text">Library</h1>
          </div>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
