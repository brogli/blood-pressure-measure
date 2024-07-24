import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Measurement } from '@/models/Measurement'

export const useMeasurementsStore = defineStore('measurements', () => {
  const measurements: Ref<Measurement[]> = ref([])
  function addMeasurement(newMeasurement: Measurement) {
    measurements.value.push(newMeasurement);
  }

  return { measurements, addMeasurement }
})
