import { describe, expect, it } from 'vitest'
import { Measurement } from '@/models/Measurement'
import { MeasurementDto, toMeasurement } from '@/models/MeasurementDto'

const row = {
  timestampIso8601: '2024-03-01T07:15:00.000Z',
  systolic: '128',
  diastolic: '84',
  heartRate: '66',
  whichArm: 'Right',
}

describe('toMeasurement', () => {
  it('reads a CSV row, converting numeric strings', () => {
    expect(toMeasurement({ ...row, id: 'abc' })).toEqual(
      new Measurement(new Date(row.timestampIso8601), 128, 84, 66, 'Right', 'abc'),
    )
  })

  it.each([null, 'text', {}, { ...row, timestampIso8601: 'not a date' }])('rejects %j', (input) => {
    expect(toMeasurement(input)).toBeUndefined()
  })

  it('defaults an empty arm to Left and empty numbers to undefined', () => {
    const m = toMeasurement({ ...row, heartRate: '', whichArm: '' })
    expect(m?.whichArm).toBe('Left')
    expect(m?.heartRate).toBeUndefined()
  })

  it('derives the same id for the same reading when the id is missing', () => {
    expect(toMeasurement(row)?.id).toBe(toMeasurement({ ...row, id: '' })?.id)
  })

  it('derives different ids for different readings', () => {
    expect(toMeasurement(row)?.id).not.toBe(toMeasurement({ ...row, systolic: '129' })?.id)
  })

  it('round-trips through MeasurementDto', () => {
    const m = new Measurement(new Date(row.timestampIso8601), 128, 84, 66, 'Right')
    expect(toMeasurement(new MeasurementDto(m))).toEqual(m)
  })
})
