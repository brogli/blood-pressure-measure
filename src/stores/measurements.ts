import { computed, type ComputedRef, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { Measurement } from "@/models/Measurement";

export const useMeasurementsStore = defineStore("measurements", () => {
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>());

  function addMeasurement(newMeasurement: Measurement) {
    state.value.set(newMeasurement.id, newMeasurement);
  }

  function clearMeasurements() {
    state.value.clear();
  }

  const measurements: ComputedRef<Measurement[]> = computed(() => Array.from(state.value.values()));

  const size: ComputedRef<number> = computed(() => state.value.size);

  return { size, measurements, addMeasurement, clearMeasurements };
});
