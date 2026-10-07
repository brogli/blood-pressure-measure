import dayjs from 'dayjs'
import { v5 as uuidv5 } from 'uuid'
import { isArmOption, Measurement } from '@/models/Measurement'

const contentIdNamespace = 'd3bffa7d-3e74-47dc-8645-4e1c499faa82'

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

  const measurement = new Measurement(
    timestamp.toDate(),
    toNumber(systolic),
    toNumber(diastolic),
    toNumber(heartRate),
    // older data can hold an empty arm (the form allowed deselecting it); 'Left' is the form default
    isArmOption(whichArm) ? whichArm : 'Left',
  )
  measurement.id = typeof id === 'string' && id ? id : contentId(measurement)
  return measurement
}

/** Same reading, same id: re-importing a CSV row without an id must not duplicate it. */
function contentId(m: Measurement): string {
  const content = [m.timestamp.toISOString(), m.systolic, m.diastolic, m.heartRate, m.whichArm]
  return uuidv5(content.join(','), contentIdNamespace)
}

function toNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}
