import { useInView } from '../hooks/useInView'
import {
  UtensilsCrossed,
  DoorOpen,
  Layers,
  BookOpen,
  Armchair,
  Baby,
} from 'lucide-react'

const services = [
  {
    icon: UtensilsCrossed,
    title: 'Кухни',
    desc: 'Эргономичные и красивые кухонные гарнитуры, созданные для сердца вашего дома.',
  },
  {
    icon: DoorOpen,
    title: 'Шкафы',
    desc: 'Вместительные шкафы-купе и встроенные системы хранения, максимально использующие пространство.',
  },
  {
    icon: Layers,
    title: 'Прихожие',
    desc: 'Уютная и функциональная мебель для входных зон и коридоров.',
  },
  {
    icon: BookOpen,
    title: 'Стеллажи',
    desc: 'Уникальные стеллажи для книг, декора и умной организации пространства.',
  },
  {
    icon: Armchair,
    title: 'Столы',
    desc: 'Обеденные и кофейные столы из массива дерева, которые станут центром вашего интерьера.',
  },
  {
    icon: Baby,
    title: 'Детская',
    desc: 'Безопасная, прочная и оригинальная мебель для детских комнат.',
  },
]

export default function Services() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="services"
      className={`bg-bg-alt transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="text-center max-w-[672px] mx-auto mb-12 sm:mb-16">
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-dark">
            Индивидуальные решения
          </h2>
          <p className="font-mulish text-base text-text mt-3">
            Созданы специально под ваше пространство и образ жизни.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((s, i) => (
            <article
              key={i}
              className={`group btn-interactive bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-primary-lighter rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <s.icon className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-playfair font-bold text-xl sm:text-2xl text-dark leading-8">
                {s.title}
              </h3>
              <p className="font-mulish text-sm text-text leading-[23px] mt-3">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
