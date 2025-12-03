import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiX } from 'react-icons/fi'
import api from '../lib/api'

interface Author {
  id: string
  name: string
  biography: string
  _count?: {
    books: number
  }
}

interface AuthorForm {
  name: string
  biography: string
}

export default function Authors() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [formData, setFormData] = useState<AuthorForm>({
    name: '',
    biography: ''
  })

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const response = await api.get('/authors')
      return response.data.data || response.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: AuthorForm) => {
      const response = await api.post('/authors', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Author created successfully!')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create author')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AuthorForm }) => {
      const response = await api.patch(`/authors/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Author updated successfully!')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update author')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/authors/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Author deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete author')
    }
  })

  const openModal = (author?: Author) => {
    if (author) {
      setEditingAuthor(author)
      setFormData({
        name: author.name,
        biography: author.biography
      })
    } else {
      setEditingAuthor(null)
      setFormData({
        name: '',
        biography: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAuthor(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAuthor) {
      updateMutation.mutate({ id: editingAuthor.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Authors</h1>
          <p className="text-gray-600 mt-1">Manage library authors</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus className="inline mr-2" />
          Add Author
        </button>
      </div>

      {/* Authors Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : authors.length === 0 ? (
        <div className="card text-center py-12">
          <FiUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No authors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author: Author) => (
            <div key={author.id} className="card hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{author.name}</h3>
                  {author._count && (
                    <p className="text-sm text-gray-600">{author._count.books} books</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(author)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id, author.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">{author.biography}</p>
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
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                <textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingAuthor ? 'Update Author' : 'Create Author'}
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
