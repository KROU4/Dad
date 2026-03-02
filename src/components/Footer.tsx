import { useInView } from '../hooks/useInView'

const navLinks = [
  { href: '#about', label: 'Обо мне' },
  { href: '#services', label: 'Услуги' },
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#contact', label: 'Контакты' },
]

export default function Footer() {
  const { ref, inView } = useInView()

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={`bg-dark-deep border-t border-white/5 transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10 sm:mb-12">
          <div>
            <h2 className="font-playfair font-bold text-2xl text-white">Игорь Велютич</h2>
            <p className="font-mulish text-sm text-white/60 mt-1">Мастерская мебели на заказ</p>
            <p className="font-mulish text-xs text-white/30 mt-1.5">УНП: BA7450163</p>
          </div>

          <nav className="flex flex-wrap gap-4 sm:gap-6" aria-label="Навигация в подвале">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`btn-interactive font-mulish text-base text-white/60 hover:text-white transition-all duration-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/5 pt-6 sm:pt-8">
          <p className="font-mulish text-xs text-white/60 text-center">
            &copy; {new Date().getFullYear()} Игорь Велютич. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
