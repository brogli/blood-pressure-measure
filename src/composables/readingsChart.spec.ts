import { describe, expect, it } from 'vitest'
import { Measurement } from '@/models/Measurement'
import {
  dayMarks,
  readingPoints,
  segmentTicks,
  toAxis,
  toSegments,
  toTime,
  axisLength,
} from '@/composables/readingsChart'

const at = (iso: string): number => new Date(iso).getTime()

describe('toSegments', () => {
  it('gives each reading ±1h and lays the windows back to back, oldest first', () => {
    const segments = toSegments([at('2026-10-02T08:00'), at('2026-10-01T08:00')])

    expect(segments).toEqual([
      { start: at('2026-10-01T07:00'), end: at('2026-10-01T09:00'), offset: 0 },
      { start: at('2026-10-02T07:00'), end: at('2026-10-02T09:00'), offset: 2 },
    ])
    expect(axisLength(segments)).toBe(4)
  })

  it('merges windows that overlap or touch', () => {
    const segments = toSegments([
      at('2026-10-01T08:00'),
      at('2026-10-01T09:30'),
      at('2026-10-01T11:30'),
    ])

    expect(segments).toEqual([
      { start: at('2026-10-01T07:00'), end: at('2026-10-01T12:30'), offset: 0 },
    ])
  })

  it('is empty without readings', () => {
    expect(toSegments([])).toEqual([])
    expect(axisLength([])).toBe(0)
  })
})

describe('toAxis and toTime', () => {
  const segments = toSegments([at('2026-10-01T08:00'), at('2026-10-03T20:00')])

  it('are inverse to each other inside the segments', () => {
    for (const iso of ['2026-10-01T07:00', '2026-10-01T08:45', '2026-10-03T19:15']) {
      expect(toTime(segments, toAxis(segments, at(iso)))).toBe(at(iso))
    }
  })

  it('places the second window right after the first', () => {
    expect(toAxis(segments, at('2026-10-03T20:00'))).toBe(3)
  })
})

describe('segmentTicks', () => {
  it('puts one tick in the middle of each window', () => {
    const segments = toSegments([
      at('2026-10-01T08:00'),
      at('2026-10-01T08:30'),
      at('2026-10-02T08:00'),
    ])

    expect(segmentTicks(segments)).toEqual([1.25, 3.5])
  })
})

describe('dayMarks', () => {
  it('marks the first window of each day and a midnight inside a window', () => {
    const segments = toSegments([
      at('2026-10-01T08:00'),
      at('2026-10-01T20:00'),
      at('2026-10-02T23:30'),
    ])

    expect(dayMarks(segments)).toEqual([0, 4, 5.5])
  })
})

describe('readingPoints', () => {
  it('keeps readings of the given arm, skips missing (0) values and coerces strings', () => {
    const left = new Measurement(new Date('2026-10-01T08:00'), 120, 80, 70, 'Left')
    const right = new Measurement(new Date('2026-10-01T09:00'), 130, 85, 70, 'Right')
    const legacy = new Measurement(new Date('2026-10-01T10:00'), 0, 0, 0, 'Left')
    // why: CSV import can leave numeric fields as strings at runtime
    Object.assign(right, { systolic: '131' })
    const measurements = [left, right, legacy]
    const segments = toSegments(measurements.map((m) => m.timestamp.getTime()))

    expect(readingPoints(measurements, segments, 'systolic', 'Left')).toEqual([{ x: 1, y: 120 }])
    expect(readingPoints(measurements, segments, 'systolic', 'Right')).toEqual([{ x: 2, y: 131 }])
  })
})
