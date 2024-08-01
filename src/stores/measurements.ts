import { computed, type ComputedRef, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { DateWrapper } from "@/models/DateWrapper";
import { Measurement } from "@/models/Measurement";

export const useMeasurementsStore = defineStore("measurements", () => {
  const localStorageKeyName = "local";
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>());

  function saveMeasurement(measurement: Measurement) {
    state.value.set(measurement.id, measurement);

    localStorage.setItem(localStorageKeyName, JSON.stringify(Array.from(state.value.values())));
  }

  function deleteMeasurement(id: string) {
    state.value.delete(id);
  }

  function clearMeasurements() {
    state.value.clear();

    localStorage.clear();
  }

  function loadFromLocalStorage(localStorageContent) {
    const objects: any[] = JSON.parse(localStorageContent);
    objects.forEach((object) => {
      const pseudoMeasurement = object as Measurement;
      const nativeTimeStamp = new Date(pseudoMeasurement.timestamp.nativeTimeStamp);
      const properDateWrapper = new DateWrapper(nativeTimeStamp);
      const properMeasurement = new Measurement(
        properDateWrapper,
        pseudoMeasurement.systolic,
        pseudoMeasurement.diastolic,
        pseudoMeasurement.heartRate,
        pseudoMeasurement.whichArm,
        pseudoMeasurement.id,
      );
      saveMeasurement(properMeasurement);
    });
  }

  const getAllMeasurements: ComputedRef<Measurement[]> = computed(() => Array.from(state.value.values()));

  const getMeasurement: ComputedRef<Measurement> = computed(() => (id: string) => state.value.get(id));

  const size: ComputedRef<number> = computed(() => state.value.size);

  const localStorageContent = localStorage.getItem(localStorageKeyName);
  if (localStorageContent !== null && localStorageContent.length > 2) {
    loadFromLocalStorage(localStorageContent);
  }
  return { size, getAllMeasurements, saveMeasurement, clearMeasurements, getMeasurement, deleteMeasurement };
});
