import dayjs from 'dayjs'
import { isArmOption, Measurement } from '@/models/Measurement'

export class MeasurementDto {
  id: string
  timestampIso8601: string
  systolic: number
  diastolic: number
  heartRate: number
  whichArm: string

  constructor(measurement: Measurement) {
    this.id = measurement.id
    this.timestampIso8601 = measurement.timestamp.toISOString()
    this.systolic = measurement.systolic || 0
    this.diastolic = measurement.diastolic || 0
    this.heartRate = measurement.heartRate || 0
    this.whichArm = measurement.whichArm
  }
}

/** Narrows untrusted data (localStorage, CSV rows); `undefined` if it is not a valid measurement. */
export function toMeasurement(dto: unknown): Measurement | undefined {
  if (typeof dto !== 'object' || dto === null) return undefined

  const { id, timestampIso8601, systolic, diastolic, heartRate, whichArm } = dto as Record<
    string,
    unknown
  > // why: a non-null object is safe to read arbitrary keys from
  if (typeof timestampIso8601 !== 'string') return undefined

  const timestamp = dayjs(timestampIso8601)
  if (!timestamp.isValid()) return undefined

  return new Measurement(
    timestamp.toDate(),
    toNumber(systolic),
    toNumber(diastolic),
    toNumber(heartRate),
    // older data can hold an empty arm (the form allowed deselecting it); 'Left' is the form default
    isArmOption(whichArm) ? whichArm : 'Left',
    typeof id === 'string' && id ? id : undefined,
  )
}

function toNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}
