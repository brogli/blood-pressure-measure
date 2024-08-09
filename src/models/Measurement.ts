import type { DateWrapper } from "@/models/DateWrapper";
import { v4 as uuidv4 } from "uuid";

export type ArmOption = "Left" | "Right";

export class Measurement {
  id: string;
  timestamp: DateWrapper;
  systolic: number;
  diastolic: number;
  heartRate: number;
  whichArm: ArmOption;

  constructor(
    timestamp: DateWrapper,
    systolic: number,
    diastolic: number,
    heartRate: number,
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
