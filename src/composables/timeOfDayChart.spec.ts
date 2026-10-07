import { describe, expect, it } from 'vitest'
import { Measurement, type ArmOption } from '@/models/Measurement'
import { dayWindow, daySeriesInWindow } from '@/composables/timeOfDayChart'

function reading(
  iso: string,
  systolic?: number,
  diastolic?: number,
  arm: ArmOption = 'Left',
): Measurement {
  return new Measurement(new Date(iso), systolic, diastolic, 70, arm)
}

const today = new Date('2026-10-07T12:00')

describe('dayWindow', () => {
  it('ends today and spans dayCount days when the offset is 0', () => {
    expect(dayWindow(7, 0, today)).toEqual({ from: '2026-10-01', to: '2026-10-07' })
  })

  it('moves back one full window per offset step', () => {
    expect(dayWindow(7, 1, today)).toEqual({ from: '2026-09-24', to: '2026-09-30' })
  })
})

describe('daySeriesInWindow', () => {
  const window = { from: '2026-10-03', to: '2026-10-06' }

  it('keeps only days inside the window that have readings, oldest first', () => {
    const series = daySeriesInWindow(
      [
        reading('2026-10-07T08:00', 123, 83),
        reading('2026-10-06T08:00', 122, 82),
        reading('2026-10-03T08:00', 121, 81),
        reading('2026-10-01T08:00', 120, 80),
      ],
      window,
    )

    expect(series.map((s) => s.date)).toEqual(['2026-10-03', '2026-10-06'])
  })

  it('orders readings within a day by time and expresses time as fractional hours', () => {
    const series = daySeriesInWindow(
      [reading('2026-10-07T19:30', 130, 85), reading('2026-10-07T07:15', 120, 80)],
      dayWindow(7, 0, today),
    )

    expect(series[0]?.readings).toEqual([
      { hour: 7.25, systolic: 120, diastolic: 80, arm: 'Left' },
      { hour: 19.5, systolic: 130, diastolic: 85, arm: 'Left' },
    ])
  })

  it('keeps the arm of each reading', () => {
    const series = daySeriesInWindow(
      [reading('2026-10-07T08:00', 120, 80, 'Right')],
      dayWindow(7, 0, today),
    )

    expect(series[0]?.readings[0]?.arm).toBe('Right')
  })

  it('treats 0 and missing values as absent', () => {
    const series = daySeriesInWindow(
      [reading('2026-10-07T08:00', 0, undefined)],
      dayWindow(7, 0, today),
    )

    expect(series[0]?.readings[0]).toEqual({
      hour: 8,
      systolic: undefined,
      diastolic: undefined,
      arm: 'Left',
    })
  })
})
