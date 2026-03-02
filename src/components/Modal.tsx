import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

export interface Work {
  id: number
  title: string
  description: string
  location: string
  category: string
  cover: string
  images: string[]
  created_at?: string
}

interface ModalProps {
  work: Work | null
  onClose: () => void
}

const filters: Record<string, string> = {
  all: 'Все',
  kitchens: 'Кухни',
  living: 'Гостиные',
  unique: 'Уникальные',
}

export default function Modal({ work, onClose }: ModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const images = work?.images?.length ? work.images : work?.cover ? [work.cover] : []
  const currentImg = images[currentIdx] || ''

  const prev = useCallback(() => {
    setCurrentIdx(i => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setCurrentIdx(i => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    setCurrentIdx(0)
  }, [work?.id])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  useEffect(() => {
    document.body.style.overflow = work ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [work])

  const minSwipe = 50
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (touchStart != null && touchEnd != null) {
      const diff = touchStart - touchEnd
      if (Math.abs(diff) > minSwipe) diff > 0 ? next() : prev()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  if (!work) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Детали проекта"
    >
      {/* Backdrop — клик закрывает, всегда получает клики с «внешней» области */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-hidden
      />

      {/* Контент — pointer-events-auto, stopPropagation при клике внутри */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-6xl lg:rounded-2xl overflow-hidden bg-bg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Изображение */}
        <div className="relative flex flex-col flex-1 min-h-[50vh] lg:min-h-[400px] flex-shrink-0">
          <div
            className="relative flex-1 flex items-center justify-center bg-dark-deep overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentImg ? (
              <img
                key={currentIdx}
                src={currentImg}
                alt={work.title}
                className="w-full h-full object-contain"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling
                  if (fallback) fallback.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center text-white/40 ${currentImg ? 'hidden' : ''}`}>
              Нет фото
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="btn-interactive absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-sm z-20"
                  aria-label="Назад"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="btn-interactive absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-sm z-20"
                  aria-label="Вперёд"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIdx ? 'bg-white w-6' : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Фото ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="btn-interactive absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-sm"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="hidden lg:flex gap-2 p-4 overflow-x-auto bg-dark-deep/50">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={`btn-interactive shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    i === currentIdx ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Панель с текстом */}
        <div className="flex-shrink-0 lg:w-[380px] bg-white overflow-y-auto max-h-[50vh] lg:max-h-none overflow-x-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-dark leading-tight">
              {work.title}
            </h2>
            {work.description && (
              <p className="font-mulish text-text leading-relaxed mt-4">
                {work.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {work.location && (
                <span className="flex items-center gap-1.5 font-mulish text-sm text-muted">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={2} />
                  {work.location}
                </span>
              )}
              {work.category && work.category !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-mulish font-medium">
                  {filters[work.category] || work.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
