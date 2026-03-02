import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useContact } from '../hooks/useContact'
import { Phone, BadgeCheck } from 'lucide-react'
import {
  sanitizePhone,
  formatPhoneDisplay,
  phoneToE164,
  sanitizeIdea,
  isValidName,
  isValidPhone,
  isValidIdea,
} from '../lib/formValidation'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', idea: '' })
  const [errors, setErrors] = useState<{ name?: string; phone?: string; idea?: string }>({})
  const { ref, inView } = useInView()
  const { submit, status, error: submitError } = useContact()

  const handleNameChange = (value: string) => {
    const v = value.replace(/[^\p{L}\s\-]/gu, '').slice(0, 50)
    setForm(prev => ({ ...prev, name: v }))
    if (errors.name) setErrors(e => ({ ...e, name: undefined }))
  }

  const handlePhoneChange = (value: string) => {
    const digits = sanitizePhone(value)
    setForm(prev => ({ ...prev, phone: formatPhoneDisplay(digits) }))
    if (errors.phone) setErrors(e => ({ ...e, phone: undefined }))
  }

  const handleIdeaChange = (value: string) => {
    setForm(prev => ({ ...prev, idea: value.slice(0, 500) }))
    if (errors.idea) setErrors(e => ({ ...e, idea: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; phone?: string; idea?: string } = {}
    if (!isValidName(form.name)) {
      newErrors.name = 'Введите имя (2–50 символов, только буквы)'
    }
    if (!isValidPhone(form.phone)) {
      newErrors.phone = 'Введите корректный номер (от 9 цифр)'
    }
    if (!isValidIdea(form.idea)) {
      newErrors.idea = 'Опишите идею (10–500 символов)'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const phoneE164 = phoneToE164(form.phone)
    const ok = await submit({
      name: form.name.trim(),
      phone: phoneE164 || form.phone,
      idea: sanitizeIdea(form.idea),
    })
    if (ok) {
      setForm({ name: '', phone: '', idea: '' })
    }
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      className={`px-4 sm:px-8 lg:px-16 py-12 sm:py-16 transition-all duration-700 ${inView ? 'is-visible' : ''} animate-section-in`}
    >
      <div className="max-w-[1152px] mx-auto bg-dark rounded-3xl shadow-2xl overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-shadow duration-500">
        <div className="flex flex-col lg:flex-row">
          <div className="bg-white p-8 sm:p-12 lg:p-16 flex-1">
            <h2 className="font-playfair font-bold text-2xl sm:text-4xl text-dark leading-10">
              Готовы обсудить ваш заказ?
            </h2>
            <p className="font-mulish text-base text-text leading-6 mt-2">
              Оставьте свои данные, и я свяжусь с вами для уточнения деталей.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 flex flex-col gap-5" noValidate>
              <div>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  placeholder="Ваше имя"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[а-яА-ЯёЁa-zA-Z\s\-]{2,50}"
                  title="Только буквы, пробелы и дефис (2–50 символов)"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className={`w-full bg-bg rounded-3xl px-5 py-4 font-mulish text-base text-dark placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.01] transition-all duration-300 ${
                    errors.name ? 'ring-2 ring-red-400' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-red-500 font-mulish text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="+375 29 670-51-92"
                  required
                  value={form.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  className={`w-full bg-bg rounded-3xl px-5 py-4 font-mulish text-base text-dark placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.01] transition-all duration-300 ${
                    errors.phone ? 'ring-2 ring-red-400' : ''
                  }`}
                  title="Введите номер цифрами"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-red-500 font-mulish text-sm">{errors.phone}</p>
                )}
              </div>
              <div>
                <textarea
                  inputMode="text"
                  autoComplete="off"
                  placeholder="Кратко опишите вашу идею (10–500 символов)"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={500}
                  value={form.idea}
                  onChange={e => handleIdeaChange(e.target.value)}
                  className={`w-full bg-bg rounded-3xl px-5 py-4 font-mulish text-base text-dark placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.01] transition-all duration-300 resize-none ${
                    errors.idea ? 'ring-2 ring-red-400' : ''
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.idea ? (
                    <p className="text-red-500 font-mulish text-sm">{errors.idea}</p>
                  ) : (
                    <span />
                  )}
                  <span className="font-mulish text-xs text-muted">{form.idea.length}/500</span>
                </div>
              </div>
              {status === 'success' && (
                <p className="text-primary font-mulish text-sm animate-hero-in">
                  Заявка отправлена! Скоро свяжусь с вами.
                </p>
              )}
              {(status === 'error' || submitError) && (
                <p className="text-red-600 font-mulish text-sm">
                  {submitError || 'Ошибка отправки. Попробуйте позже.'}
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-interactive w-full bg-primary rounded-3xl py-4 font-mulish font-bold text-base text-white shadow-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 disabled:opacity-70 transition-all duration-300"
              >
                {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </div>

          <div className="bg-dark flex-1 p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[32px] animate-float" />

            <div className="relative flex flex-col gap-8">
              <h3 className="font-playfair font-bold text-2xl text-white">
                Контактная информация
              </h3>

              <div className="flex flex-col gap-8">
                <a href="tel:+375296705192" className="flex gap-4 items-center group">
                  <div className="btn-interactive w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <Phone className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <span className="font-mulish font-light text-xl sm:text-2xl text-white tracking-[0.6px] group-hover:text-gold transition-colors duration-300">
                    +375 29 670-51-92
                  </span>
                </a>

                <div className="flex gap-4">
                  <a
                    href="https://wa.me/375296705192"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive bg-whatsapp rounded-3xl px-5 py-3 font-mulish font-bold text-sm text-white hover:opacity-90 hover:scale-105 transition-all duration-300"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive bg-telegram rounded-3xl px-5 py-3 font-mulish font-bold text-sm text-white hover:opacity-90 hover:scale-105 transition-all duration-300"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>

            <div className="relative mt-10 lg:mt-0 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <BadgeCheck className="w-5 h-5 text-gold" strokeWidth={2} />
                <span className="font-mulish font-bold text-xs text-gold tracking-[0.6px] uppercase">
                  Знак доверия
                </span>
              </div>
              <p className="font-mulish text-sm text-white/80 leading-[23px]">
                Я работаю как самозанятый профессионал. По завершении работ выдаю официальный чек
                за выполненные услуги.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
