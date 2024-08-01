import { computed, type ComputedRef, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { DateWrapper } from "@/models/DateWrapper";
import { Measurement } from "@/models/Measurement";
import { MeasurementDto } from "@/models/MeasurementDto";
import dayjs from "dayjs";

export const useMeasurementsStore = defineStore("measurements", () => {
  const localStorageKeyName = "local";
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>());

  function saveMeasurement(measurement: Measurement) {
    state.value.set(measurement.id, measurement);

    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(Array.from(state.value.values()).map((m) => toMeasurementDto(m))),
    );
  }

  function toMeasurementDto(measurement: Measurement) {
    return new MeasurementDto(measurement);
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
        measurementDto.whichArm,
        measurementDto.id,
      );
      saveMeasurement(measurement);
    });
  }

  const getAllMeasurements: ComputedRef<Measurement[]> = computed(() => Array.from(state.value.values()));

  const getMeasurement = computed(() => (id: string) => state.value.get(id));

  const size: ComputedRef<number> = computed(() => state.value.size);

  const localStorageContent: string | null = localStorage.getItem(localStorageKeyName);

  if (localStorageContent !== null && localStorageContent.length > 2) {
    loadFromLocalStorage(localStorageContent);
  }

  return { size, getAllMeasurements, saveMeasurement, clearMeasurements, getMeasurement, deleteMeasurement };
});
