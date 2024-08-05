import { computed, type ComputedRef, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { DateWrapper } from "@/models/DateWrapper";
import { type ArmOption, Measurement } from "@/models/Measurement";
import { MeasurementDto } from "@/models/MeasurementDto";
import dayjs from "dayjs";
import Papa from "papaparse";

export const useMeasurementsStore = defineStore("measurements", () => {
  const localStorageKeyName = "local";
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>());

  function saveMeasurement(measurement: Measurement) {
    state.value.set(measurement.id, measurement);

    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(Array.from(state.value.values()).map((m) => new MeasurementDto(m))),
    );
  }

  function deleteMeasurement(id: string | undefined) {
    if (id) {
      state.value.delete(id);
    } else {
      // TODO: show error
    }
  }

  function clearMeasurements() {
    state.value.clear();

    localStorage.clear();
  }

  function loadFromLocalStorage(localStorageContent: string) {
    const dtos: MeasurementDto[] = JSON.parse(localStorageContent);
    dtos.forEach((measurementDto) => {
      const nativeTimeStamp = dayjs(measurementDto.timestampIso8601).toDate();
      const dateWrapper = new DateWrapper(nativeTimeStamp);
      const measurement = new Measurement(
        dateWrapper,
        measurementDto.systolic,
        measurementDto.diastolic,
        measurementDto.heartRate,
        measurementDto.whichArm as ArmOption,
        measurementDto.id,
      );
      saveMeasurement(measurement);
    });
  }

  function getMeasurementsAsCsv(): string {
    const measurementDtos = Array.from(state.value.values()).map((m) => new MeasurementDto(m));
    const measurementsAsCsv = Papa.unparse({
      fields: Object.keys(measurementDtos[0]),
      data: measurementDtos.map((m) => Object.values(m)),
    });

    return measurementsAsCsv;
  }

  const getAllMeasurements: ComputedRef<Measurement[]> = computed(() => Array.from(state.value.values()));

  const getMeasurement = computed(() => (id: string) => state.value.get(id));

  const size: ComputedRef<number> = computed(() => state.value.size);

  const localStorageContent: string | null = localStorage.getItem(localStorageKeyName);

  if (localStorageContent !== null && localStorageContent.length > 2) {
    loadFromLocalStorage(localStorageContent);
  }

  return {
    size,
    getAllMeasurements,
    saveMeasurement,
    clearMeasurements,
    getMeasurement,
    deleteMeasurement,
    getMeasurementsAsCsv,
  };
});
