import { useMeasurementsStore } from "@/stores/measurements";
import { MeasurementDto } from "@/models/MeasurementDto";
import Papa from "papaparse";

export function useExportFile(fileName: string) {
  const measurementsStore = useMeasurementsStore();

  const measurementDtos = measurementsStore.getAllMeasurements.map((m) => new MeasurementDto(m));
  const measurementsAsCsv = Papa.unparse({
    fields: Object.keys(measurementDtos[0]),
    data: measurementDtos.map((m) => Object.values(m)),
  });

  const blob = new Blob([measurementsAsCsv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
