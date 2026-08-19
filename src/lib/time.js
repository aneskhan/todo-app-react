const relative = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' })
const absolute = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' })

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** «только что» / «3 ч назад» / «вчера» / «12 мар». */
export function formatCreatedAt(timestamp) {
  const diff = Date.now() - timestamp
  if (!Number.isFinite(diff)) return ''
  if (diff < MINUTE) return 'только что'
  if (diff < HOUR) return relative.format(-Math.floor(diff / MINUTE), 'minute')
  if (diff < DAY) return relative.format(-Math.floor(diff / HOUR), 'hour')
  if (diff < 7 * DAY) return relative.format(-Math.floor(diff / DAY), 'day')
  return absolute.format(timestamp)
}
