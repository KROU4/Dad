import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useWorks } from '../hooks/useWorks'
import Modal, { type Work } from './Modal'

type Category = 'all' | 'kitchens' | 'living' | 'unique'

const filters: { key: Category; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'kitchens', label: 'Кухни' },
  { key: 'living', label: 'Гостиные' },
  { key: 'unique', label: 'Уникальные' },
]

export default function Portfolio() {
  const [active, setActive] = useState<Category>('all')
  const { ref, inView } = useInView()
  const { works, loading } = useWorks()
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  const filtered =
    active === 'all'
      ? works
      : works.filter(
          p =>
            p.category === active ||
            (Array.isArray(p.category) && (p.category as string[]).includes(active))
        )

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="portfolio"
      className={`relative overflow-hidden transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="flex flex-col gap-8 mb-10 sm:mb-14">
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-dark">
            Мои работы
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`btn-interactive shrink-0 font-mulish font-medium text-sm px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                  active === f.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white/80 text-text border border-border hover:border-primary/40 hover:scale-[1.02]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3" style={{ columnGap: 0 }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="break-inside-avoid p-1 sm:p-2">
                <div
                  className={`skeleton-shimmer border border-border rounded-lg ${
                    n % 3 === 0 ? 'aspect-[4/5]' : n % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 px-6 rounded-3xl bg-white/50 border border-dashed border-border">
            <p className="font-mulish text-muted text-lg">Пока нет работ</p>
            <p className="font-mulish text-sm text-muted mt-1">Добавьте проекты в админ-панели</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3" style={{ columnGap: 0 }}>
            {filtered.map((project, i) => (
              <article
                key={project.id}
                className="group cursor-pointer animate-gallery-card break-inside-avoid p-1 sm:p-2"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                onClick={() => setSelectedWork(project)}
              >
                <div className="relative overflow-hidden rounded-lg bg-dark-deep border border-border group-hover:border-primary/30 group-active:scale-[0.99] transition-all duration-300 ease-out">
                  {project.cover || project.images?.[0] ? (
                    <img
                      src={project.cover || project.images?.[0]}
                      alt={project.title}
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-primary-lighter text-muted min-h-[200px] ${
                      project.cover || project.images?.[0] ? 'hidden' : ''
                    }`}
                  >
                    <span className="font-mulish text-sm">Нет фото</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-active:translate-y-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300">
                    <h3 className="font-playfair font-bold text-lg sm:text-xl text-white drop-shadow-lg">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="font-mulish text-sm text-white/80 mt-0.5">
                        {project.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 px-1 sm:hidden">
                  <h3 className="font-playfair font-bold text-lg text-dark truncate">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="font-mulish text-sm text-muted truncate">
                      {project.location}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </section>
  )
}
