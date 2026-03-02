import { useInView } from '../hooks/useInView'
import craftsmanImg from '../assets/craftsman.jpg'
import { Briefcase, Shield, Clock } from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Работаю официально',
    desc: 'Полностью зарегистрированный самозанятый. Прозрачные договоры и платежи.',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    desc: 'Гарантированное качество на все изделия. Я отвечаю за свою работу годами.',
  },
  {
    icon: Clock,
    title: 'Точно в срок',
    desc: 'Сроки соблюдаются неукоснительно. Ваша мебель прибудет именно тогда, когда обещано.',
  },
]

export default function About() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="about"
      className={`bg-white transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="relative w-full lg:flex-1 max-w-[536px]">
            <div className="absolute -inset-4 sm:-inset-6 bg-gold/20 rounded-2xl rotate-2 transition-transform duration-500 hover:rotate-3" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={craftsmanImg}
                alt="Игорь Велютич — мастер по изготовлению мебели"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-dark">
                Мастер своего дела
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full origin-left transition-transform duration-700 delay-200" style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)' }} />
              <p className="font-mulish text-lg text-text leading-[29px] pt-2">
                Я — Игорь Велютич, мебельщик, специализирующийся на создании
                уникальных изделий. С многолетним опытом и страстью к дереву, я
                слежу за каждой деталью — от первого эскиза до финальной
                полировки. Моя цель — создавать мебель, которая рассказывает
                историю и служит поколениями.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`btn-interactive flex gap-4 items-start p-4 rounded-3xl hover:bg-bg hover:shadow-md transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${300 + i * 80}ms` }}
                >
                  <div className="shrink-0 w-12 h-12 bg-primary-light rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <f.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-lg sm:text-xl text-dark leading-7">
                      {f.title}
                    </h3>
                    <p className="font-mulish text-sm text-text leading-5 mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
