import { describe, expect, it } from 'vitest'
import { Measurement } from '@/models/Measurement'
import { averagesByGroup } from '@/composables/averageChart'

const byDay = (timestamp: Date) => timestamp.toISOString().slice(0, 10)
const reading = (iso: string, systolic: number, heartRate?: number) =>
  new Measurement(new Date(iso), systolic, 80, heartRate, 'Left')

describe('averagesByGroup', () => {
  it('averages per group, oldest first, rounded', () => {
    const measurements = [
      reading('2026-10-02T08:00Z', 130),
      reading('2026-10-01T08:00Z', 120),
      reading('2026-10-01T20:00Z', 125),
    ]
    expect(averagesByGroup(measurements, byDay, null).map((a) => [a.date, a.systolic])).toEqual([
      ['2026-10-01', 123],
      ['2026-10-02', 130],
    ])
  })

  it('skips readings before the cutoff', () => {
    const measurements = [reading('2026-09-01T08:00Z', 120), reading('2026-10-01T08:00Z', 130)]
    const averages = averagesByGroup(measurements, byDay, new Date('2026-09-15'))
    expect(averages.map((a) => a.date)).toEqual(['2026-10-01'])
  })

  it('ignores missing and legacy 0 values', () => {
    const measurements = [reading('2026-10-01T08:00Z', 120, 0), reading('2026-10-01T20:00Z', 124)]
    expect(averagesByGroup(measurements, byDay, null)[0]?.heartRate).toBeNull()
  })
})
