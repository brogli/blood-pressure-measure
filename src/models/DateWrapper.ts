export class DateWrapper {
  nativeTimeStamp: Date;

  constructor(timestamp: Date) {
    this.nativeTimeStamp = timestamp;
  }

  public toString(): string {
    return this.nativeTimeStamp.toLocaleString();
  }
}
