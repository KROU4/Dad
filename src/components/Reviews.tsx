import { useRef } from 'react'
import { useInView } from '../hooks/useInView'
import { Star } from 'lucide-react'
import { FaUserCircle } from 'react-icons/fa'

const reviews = [
  {
    name: 'Елена С.',
    text: '«Игорь сделал для нас прекрасный обеденный стол из дуба. Качество исключительное, гораздо лучше, чем в любом магазине. Очень рекомендую!»',
    stars: 5,
  },
  {
    name: 'Михаил Д.',
    text: '«Профессионал от начала до конца. Встроенный шкаф идеально вписался в нашу спальню нестандартной формы. Настоящее мастерство.»',
    stars: 5,
  },
  {
    name: 'Анна К.',
    text: '«Отличный опыт. Сроки были соблюдены, а мебель выглядит потрясающе. Игорь очень вежливый и аккуратный.»',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-gold fill-gold transition-transform duration-300 hover:scale-125" strokeWidth={2} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="reviews"
      className={`bg-bg transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-dark mb-10 sm:mb-12">
          Отзывы клиентов
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((r, i) => (
            <article
              key={i}
              className={`btn-interactive flex-shrink-0 w-[320px] sm:w-[360px] bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] snap-start flex flex-col gap-4 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full shrink-0 text-muted transition-transform duration-300 hover:scale-110">
                  <FaUserCircle className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-mulish font-bold text-base text-dark">{r.name}</h4>
                  <Stars count={r.stars} />
                </div>
              </div>
              <p className="font-mulish text-sm text-text leading-5">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
