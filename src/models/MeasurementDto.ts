import type { Measurement } from "@/models/Measurement";

export class MeasurementDto {
  id: string;
  timestampIso8601: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  whichArm: string;

  constructor(measurement: Measurement) {
    this.id = measurement.id;
    this.timestampIso8601 = measurement.timestamp.nativeTimeStamp.toISOString();
    this.systolic = measurement.systolic;
    this.diastolic = measurement.diastolic;
    this.heartRate = measurement.heartRate;
    this.whichArm = measurement.whichArm;
  }
}
