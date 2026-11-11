export function getInitLocale(): string {
  if (navigator.language.toUpperCase().startsWith('EN')) {
    return 'en'
  } else if (navigator.language.toUpperCase() === 'DE-CH') {
    return 'ch'
  } else if (navigator.language.toUpperCase().startsWith('DE')) {
    return 'de'
  } else {
    return 'en'
  }
}

/** App locale to BCP 47 locale ('ch' is not a valid BCP 47 tag). */
const dateLocales: Record<string, string> = { en: 'en-GB', de: 'de-DE', ch: 'de-CH' }

const timestampFormat: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

const dateLocale = (appLocale: string): string => dateLocales[appLocale] ?? 'en-GB'

export function formatTimestamp(timestamp: Date, appLocale: string): string {
  return timestamp.toLocaleString(dateLocale(appLocale), timestampFormat)
}

export function formatDayMonth(date: Date, appLocale: string): string {
  return date.toLocaleDateString(dateLocale(appLocale), { day: '2-digit', month: '2-digit' })
}
