import { useFileDialog } from "@vueuse/core";
import Papa from "papaparse";
import { MeasurementDto } from "@/models/MeasurementDto";
import { type ArmOption, Measurement } from "@/models/Measurement";
import { DateWrapper } from "@/models/DateWrapper";
import dayjs from "dayjs";
import { useMeasurementsStore } from "@/stores/measurements";

export function useImportfile() {
  const measurementsStore = useMeasurementsStore();
  let fileContent: string;

  const { open, onChange } = useFileDialog({
    accept: "text/csv",
  });

  onChange((files) => {
    const myFile = files?.item(0);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      fileContent = fileReader.result as string;
      parseCsv(fileContent);
    };
    if (myFile) {
      fileReader.readAsText(myFile);
    } else {
      // TODO: throw error
    }
  });

  function parseCsv(text: string) {
    Papa.parse(text, { complete: deserializeToMeasurements, header: true });
  }

  function deserializeToMeasurements(results: any) {
    results.data.forEach((item: MeasurementDto) => {
      const measurement = new Measurement(
        new DateWrapper(dayjs(item.timestampIso8601).toDate()),
        item.systolic,
        item.diastolic,
        item.heartRate,
        item.whichArm as ArmOption,
        item.id,
      );
      measurementsStore.saveMeasurement(measurement);
    });
  }

  return { open };
}
