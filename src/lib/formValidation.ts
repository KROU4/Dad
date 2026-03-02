// Регулярные выражения для валидации формы

/** Имя: буквы (включая кириллицу), пробелы, дефис. 2-50 символов */
export const NAME_REGEX = /^[\p{L}\s\-]{2,50}$/u
export const NAME_PATTERN = '[\\p{L}\\s\\-]{2,50}'

/** Телефон: только цифры. Мин 9, макс 15 (с кодом страны) */
export const PHONE_DIGITS_ONLY = /^\d{9,15}$/
export const PHONE_DISPLAY_REGEX = /^(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/

/** Удалить всё кроме цифр из строки телефона */
export function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 15)
}

/** Форматировать телефон для отображения: +375 29 670-51-92 */
export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (!d) return ''
  let n = d
  if (d.startsWith('8') && d.length > 1) n = '7' + d.slice(1)
  else if (d.length === 9 && d.startsWith('29')) n = '375' + d
  else if (d.length >= 9 && !d.startsWith('375') && !d.startsWith('7')) n = '375' + d
  if (n.length <= 3) return '+' + n
  if (n.length <= 5) return `+${n.slice(0, 3)} ${n.slice(3)}`
  if (n.length <= 8) return `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5)}`
  return `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)}-${n.slice(8, 10)}-${n.slice(10, 12)}`
}

/** Получить цифры для отправки (E.164: +375296705192) */
export function phoneToE164(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length < 9) return ''
  if (d.startsWith('375') || d.startsWith('7')) return '+' + d
  if (d.startsWith('8')) return '+7' + d.slice(1)
  if (d.startsWith('29')) return '+375' + d
  return '+375' + d
}

export function isValidName(name: string): boolean {
  return NAME_REGEX.test(name.trim())
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

/** Идея: 10-500 символов, без опасных тегов */
const IDEA_SANITIZE = /<[^>]*>|javascript:|on\w+=/gi

export function sanitizeIdea(text: string): string {
  return text.replace(IDEA_SANITIZE, '').trim().slice(0, 500)
}

export function isValidIdea(idea: string): boolean {
  const s = sanitizeIdea(idea)
  return s.length >= 10 && s.length <= 500
}
