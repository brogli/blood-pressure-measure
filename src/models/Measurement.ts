import { v4 as uuidv4 } from "uuid";

export type ArmOption = "Left" | "Right";

export class Measurement {
  id: string;
  timestamp: Date;
  systolic: number | undefined;
  diastolic: number | undefined;
  heartRate: number | undefined;
  whichArm: ArmOption;

  constructor(
    timestamp: Date,
    systolic: number | undefined,
    diastolic: number | undefined,
    heartRate: number | undefined,
    armOption: ArmOption,
    id: string = uuidv4(),
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.heartRate = heartRate;
    this.whichArm = armOption;
  }

  getClone(): Measurement {
    return new Measurement(this.timestamp, this.systolic, this.diastolic, this.heartRate, this.whichArm, this.id);
  }
}
