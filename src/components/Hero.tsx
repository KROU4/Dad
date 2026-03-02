import heroBg from '../assets/hero-bg.jpg'

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[600px] flex items-center pt-[80px] overflow-hidden">
      {/* Background с параллакс-эффектом */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Мастерская мебели"
          className="w-full h-full object-cover animate-hero-bg"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 to-dark/50" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[672px] flex flex-col gap-5 sm:gap-6">
          {/* Badge */}
          <div
            className="inline-flex self-start backdrop-blur-sm bg-gold/20 border border-gold/40 rounded-full px-3.5 py-1.5 animate-hero-in"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <span className="font-mulish font-bold text-xs text-gold tracking-[1.2px] uppercase">
              Изготовление и сборка
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-playfair font-bold text-4xl sm:text-5xl lg:text-[60px] text-white leading-[1.1] sm:leading-[60px] animate-hero-in"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            Мебель, которая создаётся для вас, а&nbsp;не&nbsp;для&nbsp;склада
          </h2>

          {/* Subtitle */}
          <p
            className="font-mulish font-light text-lg sm:text-xl text-white/80 leading-7 max-w-[512px] animate-hero-in"
            style={{ animationDelay: '0.35s', opacity: 0 }}
          >
            Я создаю уникальную мебель, которая приносит тепло и функциональность
            в ваш дом. Никакого массового производства — только ручная работа.
          </p>

          {/* CTA */}
          <div
            className="flex flex-wrap gap-4 pt-2 sm:pt-4 animate-hero-in"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            <a
              href="#portfolio"
              className="btn-interactive relative bg-primary rounded-3xl px-6 sm:px-8 py-3.5 font-mulish font-bold text-base text-white text-center shadow-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              Смотреть работы
            </a>
            <a
              href="#contact"
              className="btn-interactive border-2 border-white/30 rounded-3xl px-6 sm:px-8 py-3.5 font-mulish font-bold text-base text-white text-center hover:border-white/60 hover:bg-white/5 transition-all duration-300"
            >
              Связаться
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
