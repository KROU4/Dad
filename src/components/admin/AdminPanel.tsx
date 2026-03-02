import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import WorkForm from './WorkForm'
import { useAdminWorks } from '../../hooks/useAdminWorks'
import type { Work } from '../../hooks/useAdminWorks'

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const { works, loading, createWork, updateWork, togglePublish, deleteWork } = useAdminWorks()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту работу?')) return
    try {
      await deleteWork(id)
    } catch (e) {
      console.error(e)
    }
  }

  const handleTogglePublish = async (w: Work) => {
    try {
      await togglePublish(w)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFormSubmit = async (data: {
    title: string
    description: string
    location: string
    category: string
    published: boolean
    existingImages: string[]
    newFiles: File[]
  }) => {
    setSubmitError(null)
    try {
      if (editingId) {
        await updateWork(editingId, data)
      } else {
        await createWork(data)
      }
      setEditingId(null)
      setShowForm(false)
    } catch (e) {
      setSubmitError((e as Error).message)
    }
  }

  const workToEdit = editingId ? works.find(w => w.id === editingId) : null

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-dark text-white p-4 flex items-center justify-between">
        <h1 className="font-playfair font-bold text-xl">Админ-панель</h1>
        <button
          onClick={onLogout}
          className="font-mulish text-sm text-white/80 hover:text-white"
        >
          Выйти
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {showForm && !workToEdit ? (
          <div>
            <h2 className="font-playfair font-bold text-2xl text-dark mb-6">Добавить работу</h2>
            {submitError && (
              <p className="text-red-600 font-mulish text-sm mb-4">{submitError}</p>
            )}
            <WorkForm
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : workToEdit ? (
          <div>
            <h2 className="font-playfair font-bold text-2xl text-dark mb-6">
              Редактировать работу
            </h2>
            {submitError && (
              <p className="text-red-600 font-mulish text-sm mb-4">{submitError}</p>
            )}
            <WorkForm
              initial={{
                title: workToEdit.title,
                description: workToEdit.description,
                location: workToEdit.location,
                category: workToEdit.category,
                published: !!workToEdit.published,
                cover: workToEdit.cover,
                images: workToEdit.images,
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair font-bold text-2xl text-dark">Мои работы</h2>
              <button
                onClick={() => setShowForm(true)}
                className="btn-interactive flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-mulish font-bold hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Добавить работу
              </button>
            </div>

            {loading ? (
              <p className="text-muted">Загрузка...</p>
            ) : works.length === 0 ? (
              <p className="text-muted">Нет работ. Добавьте первую!</p>
            ) : (
              <div className="space-y-4">
                {works.map(w => (
                  <div
                    key={w.id}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-border">
                      <img
                        src={w.cover || w.images?.[0]}
                        alt={w.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair font-bold text-dark truncate">{w.title}</h3>
                      <p className="font-mulish text-sm text-muted">
                        {w.category} • {w.published ? 'Опубликовано' : 'Скрыто'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleTogglePublish(w)}
                        className="p-2 rounded-lg hover:bg-bg transition-colors"
                        title={w.published ? 'Скрыть' : 'Показать'}
                      >
                        {w.published ? (
                          <EyeOff className="w-4 h-4 text-muted" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(w.id)}
                        className="p-2 rounded-lg hover:bg-bg transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
