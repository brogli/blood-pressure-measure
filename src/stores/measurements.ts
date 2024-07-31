import { computed, type ComputedRef, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { Measurement } from "@/models/Measurement";

export const useMeasurementsStore = defineStore("measurements", () => {
  const state = useLocalStorage("measurements-local", new Map<string, Measurement>());

  function saveMeasurement(measurement: Measurement) {
    state.value.set(measurement.id, measurement);
  }

  function clearMeasurements() {
    state.value.clear();
  }

  const getAllMeasurements: ComputedRef<Measurement[]> = computed(() => Array.from(state.value.values()));

  const getMeasurement: ComputedRef<Measurement> = computed(() => (id: string) => state.value.get(id));

  const size: ComputedRef<number> = computed(() => state.value.size);

  return { size, getAllMeasurements, saveMeasurement, clearMeasurements, getMeasurement };
});
