import { useInView } from '../hooks/useInView'
import { MessageCircle, Ruler, Wrench, Truck } from 'lucide-react'

const steps = [
  {
    num: 1,
    icon: MessageCircle,
    title: 'Консультация',
    desc: 'Первичная консультация для обсуждения ваших потребностей и идей.',
  },
  {
    num: 2,
    icon: Ruler,
    title: 'Замер',
    desc: 'Точные замеры и подбор материалов у вас дома.',
  },
  {
    num: 3,
    icon: Wrench,
    title: 'Производство',
    desc: 'Изготовление вашей мебели с вниманием к каждой детали.',
  },
  {
    num: 4,
    icon: Truck,
    title: 'Доставка',
    desc: 'Безопасная доставка и профессиональная установка.',
  },
]

export default function Process() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="process"
      className={`bg-white border-t border-b border-border transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-dark text-center mb-12 sm:mb-16">
          Как мы работаем
        </h2>

        <div className="relative">
          <div
            className="hidden sm:block absolute top-[32px] left-[12%] right-[12%] h-0.5 bg-border origin-left transition-transform duration-1000"
            style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center relative transition-all duration-600 ${
                  inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                <div
                  className={`btn-interactive relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-sm bg-bg border-2 transition-all duration-300 hover:scale-110 ${
                    i === 0 ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span
                    className={`font-mulish font-bold text-xl ${
                      i === 0 ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    {step.num}
                  </span>
                </div>
                <div className="mt-4 mb-3 transition-transform duration-300 hover:scale-110">
                  <step.icon className="w-7 h-7 text-primary/60" strokeWidth={2} />
                </div>
                <h3 className="font-playfair font-bold text-lg sm:text-xl text-dark leading-7">
                  {step.title}
                </h3>
                <p className="font-mulish text-sm text-text leading-5 mt-2 max-w-[260px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
