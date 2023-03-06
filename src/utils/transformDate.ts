export function formattingDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
    calendar: 'gregory',
  }).format(date)
}
