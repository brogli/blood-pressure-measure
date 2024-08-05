import { useMeasurementsStore } from "@/stores/measurements";

export function useExportFile(fileName: string) {
  const measurementsStore = useMeasurementsStore();

  const blob = new Blob([measurementsStore.getMeasurementsAsCsv()], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
