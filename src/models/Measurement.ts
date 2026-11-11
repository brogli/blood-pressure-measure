import { v4 as uuidv4 } from 'uuid'

export type ArmOption = 'Left' | 'Right'

export function isArmOption(value: unknown): value is ArmOption {
  return value === 'Left' || value === 'Right'
}

/** `0` marks a missing value in legacy CSV data; imported fields may still be strings. */
export function presentValue(value: number | undefined): number | undefined {
  return Number(value) || undefined
}

export class Measurement {
  id: string
  timestamp: Date
  systolic: number | undefined
  diastolic: number | undefined
  heartRate: number | undefined
  whichArm: ArmOption

  constructor(
    timestamp: Date,
    systolic: number | undefined,
    diastolic: number | undefined,
    heartRate: number | undefined,
    armOption: ArmOption,
    id: string = uuidv4(),
  ) {
    this.id = id
    this.timestamp = timestamp
    this.systolic = systolic
    this.diastolic = diastolic
    this.heartRate = heartRate
    this.whichArm = armOption
  }

  getClone(): Measurement {
    return new Measurement(
      this.timestamp,
      this.systolic,
      this.diastolic,
      this.heartRate,
      this.whichArm,
      this.id,
    )
  }
}
