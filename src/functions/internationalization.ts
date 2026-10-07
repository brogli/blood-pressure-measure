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

export function formatTimestamp(timestamp: Date, appLocale: string): string {
  return timestamp.toLocaleString(dateLocales[appLocale] ?? 'en-GB', timestampFormat)
}
