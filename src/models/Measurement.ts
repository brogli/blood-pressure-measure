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

  constructor(timestamp: DateWrapper, systolic: number, diastolic: number, heartRate: number, armOption: ArmOption) {
    this.id = uuidv4();
    this.timestamp = timestamp;
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.heartRate = heartRate;
    this.whichArm = armOption;
  }
}
