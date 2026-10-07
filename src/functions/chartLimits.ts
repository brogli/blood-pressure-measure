import type { AnnotationOptions } from 'chartjs-plugin-annotation'

/** Upper bounds of the normal range in mmHg; readings above them are drawn against these lines. */
export const LIMITS = { systolic: 130, diastolic: 85 } as const

type Translate = (key: string) => string

export function limitLineAnnotations(
  t: Translate,
  color: string,
): Record<keyof typeof LIMITS, AnnotationOptions<'line'>> {
  const line = (metric: keyof typeof LIMITS): AnnotationOptions<'line'> => ({
    type: 'line',
    yMin: LIMITS[metric],
    yMax: LIMITS[metric],
    borderColor: color,
    borderWidth: 1,
    borderDash: [3, 3],
    label: {
      display: true,
      content: `${t(`measurement.${metric}`)} ${LIMITS[metric]}`,
      position: 'start',
      color,
      backgroundColor: 'transparent',
      font: { size: 11 },
      padding: 2,
      yAdjust: -8,
    },
  })
  return { systolic: line('systolic'), diastolic: line('diastolic') }
}
