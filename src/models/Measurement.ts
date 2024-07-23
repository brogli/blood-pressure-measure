export type ArmOption = "Left" | "Right";

export class Measurement {
  timestamp: Date
  systolic: number
  diastolic: number
  heartRate: number
  whichArm: ArmOption

  constructor(timestamp: Date, systolic: number, diastolic: number, heartRate: number, armOption: ArmOption
  ) {
    this.timestamp = timestamp;
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.heartRate = heartRate;
    this.whichArm = armOption;
  }
}
