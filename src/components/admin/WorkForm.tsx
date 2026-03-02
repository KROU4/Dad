import { useState, useRef } from 'react'
import { GripVertical, X } from 'lucide-react'

export interface WorkInput {
  id?: number
  title: string
  description: string
  location: string
  category: string
  published: boolean
  cover?: string
  images?: string[]
}

type ImageItem = { type: 'existing'; url: string } | { type: 'file'; file: File }

function buildInitialImageItems(cover?: string, images?: string[]): ImageItem[] {
  const arr = images && Array.isArray(images) ? [...images] : []
  const ordered = cover
    ? [cover, ...arr.filter(u => u !== cover)]
    : arr
  return ordered.filter(Boolean).map(url => ({ type: 'existing' as const, url }))
}

type SubmitData = {
  title: string
  description: string
  location: string
  category: string
  published: boolean
  existingImages: string[]
  newFiles: File[]
}

interface WorkFormProps {
  initial?: Partial<WorkInput>
  onSubmit: (data: SubmitData) => Promise<void>
  onCancel: () => void
}

const categories = [
  { value: 'all', label: 'Все' },
  { value: 'kitchens', label: 'Кухни' },
  { value: 'living', label: 'Гостиные' },
  { value: 'unique', label: 'Уникальные' },
]

export default function WorkForm({ initial, onSubmit, onCancel }: WorkFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'all')
  const [published, setPublished] = useState(initial?.published ?? true)
  const [imageItems, setImageItems] = useState<ImageItem[]>(() =>
    buildInitialImageItems(initial?.cover, initial?.images)
  )
  const [loading, setLoading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected?.length) {
      setImageItems(prev => [
        ...prev,
        ...Array.from(selected).map(file => ({ type: 'file' as const, file })),
      ])
    }
    e.target.value = ''
  }

  const removeImage = (i: number) => {
    setImageItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.setData('application/json', JSON.stringify({ index }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    const fromIndex = draggedIndex
    setDraggedIndex(null)
    if (fromIndex == null || fromIndex === toIndex) return
    setImageItems(prev => {
      const next = [...prev]
      const [removed] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, removed)
      return next
    })
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const existingImages = imageItems
      .filter((item): item is { type: 'existing'; url: string } => item.type === 'existing')
      .map(item => item.url)
    const newFiles = imageItems
      .filter((item): item is { type: 'file'; file: File } => item.type === 'file')
      .map(item => item.file)
    try {
      await onSubmit({
        title,
        description,
        location,
        category,
        published,
        existingImages,
        newFiles,
      })
    } finally {
      setLoading(false)
    }
  }

  const getImageSrc = (item: ImageItem): string => {
    if (item.type === 'existing') return item.url
    return URL.createObjectURL(item.file)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block font-mulish font-medium text-dark mb-2">Название *</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block font-mulish font-medium text-dark mb-2">Описание</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>
      <div>
        <label className="block font-mulish font-medium text-dark mb-2">Город / год</label>
        <input
          type="text"
          placeholder="Москва, 2023"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block font-mulish font-medium text-dark mb-2">Категория</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark outline-none focus:ring-2 focus:ring-primary/30"
        >
          {categories.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-mulish font-medium text-dark mb-2">Изображения</label>
        <p className="font-mulish text-sm text-muted mb-2">
          Первое фото — обложка. Перетаскивайте для изменения порядка.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors mb-3"
        >
          <p className="font-mulish text-muted">Нажмите для добавления новых фото</p>
        </div>
        {imageItems.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageItems.map((item, i) => (
              <div
                key={item.type === 'existing' ? item.url : `${i}-${item.file.name}`}
                draggable
                onDragStart={e => handleDragStart(e, i)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                className={`relative group flex items-center gap-1 bg-bg rounded-lg border border-border p-1 pr-0 cursor-grab active:cursor-grabbing transition-opacity ${
                  draggedIndex === i ? 'opacity-50' : ''
                }`}
              >
                <div
                  className="flex items-center justify-center w-6 h-14 shrink-0 text-muted"
                  title="Перетащите для изменения порядка"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="relative">
                  <img
                    src={getImageSrc(item)}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-mulish text-center py-0.5 rounded-b-lg">
                      Обложка
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Удалить"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={e => setPublished(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
        />
        <label htmlFor="published" className="font-mulish text-dark">
          Опубликовано (показывать на сайте)
        </label>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-interactive flex-1 bg-primary text-white font-mulish font-bold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-border rounded-xl font-mulish font-medium text-dark hover:bg-bg transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
