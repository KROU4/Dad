import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'

const navLinks = [
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#about', label: 'Обо мне' },
  { href: '#services', label: 'Услуги' },
  { href: '#process', label: 'Процесс' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contact', label: 'Контакты' },
]

interface HeaderProps {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'bg-dark-deep/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-dark'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-[72px]">
        <div className="flex items-center justify-between h-[70px] sm:h-[80px]">
          {/* Logo */}
          <a href="#" className="shrink-0">
            <h1 className="font-playfair font-bold text-xl sm:text-2xl text-white tracking-[0.6px] leading-8">
              Игорь Велютич
            </h1>
            <p className="font-mulish text-[11px] sm:text-xs text-gold/90 tracking-[1.2px] uppercase leading-4">
              Мебель на заказ
            </p>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 items-center" aria-label="Основная навигация">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-mulish font-medium text-sm text-white/90 hover:text-gold transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 after:w-0 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <a
            href="#contact"
            className="btn-interactive hidden lg:flex items-center gap-2 bg-primary px-5 xl:px-6 py-2.5 rounded-3xl shadow-lg hover:bg-primary/90"
          >
            <MessageSquare className="w-[15px] h-[15px]" strokeWidth={2} />
            <span className="font-mulish font-bold text-sm text-white">Обсудить заказ</span>
          </a>

          {/* Mobile menu button */}
          <button
            className="btn-interactive lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
            aria-expanded={isMenuOpen}
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out bg-dark-deep ${
          isMenuOpen ? 'max-h-[400px] pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 sm:px-8" aria-label="Мобильная навигация">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-mulish font-medium text-base text-white/90 hover:text-gold py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-300 hover:pl-6"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="btn-interactive mt-2 flex items-center justify-center gap-2 bg-primary px-6 py-3 rounded-3xl font-mulish font-bold text-sm text-white"
          >
            Обсудить заказ
          </a>
        </nav>
      </div>
    </header>
  )
}
