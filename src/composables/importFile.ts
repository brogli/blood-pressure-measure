import { useFileDialog } from "@vueuse/core";
import Papa from "papaparse";
import { MeasurementDto } from "@/models/MeasurementDto";
import { type ArmOption, Measurement } from "@/models/Measurement";
import dayjs from "dayjs";
import { useMeasurementsStore } from "@/stores/measurements";
import { storeToRefs } from "pinia";
import { useToastStore } from "@/stores/toastStore";

export function useImportfile(t: any) {
  const measurementsStore = useMeasurementsStore();
  const { currentToast } = storeToRefs(useToastStore());

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
      currentToast.value = {
        severity: "error",
        summary: "Error",
        detail: t("toasts.errorWhileImportingCsv"),
        life: 3000,
      };
    }
  });

  function parseCsv(text: string) {
    Papa.parse(text, { complete: deserializeToMeasurements, header: true });
  }

  function deserializeToMeasurements(results: any) {
    results.data.forEach((item: MeasurementDto) => {
      const measurement = new Measurement(
        dayjs(item.timestampIso8601).toDate(),
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
