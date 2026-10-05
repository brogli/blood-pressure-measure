import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Measurement } from '@/models/Measurement'
import { MeasurementDto, toMeasurement } from '@/models/MeasurementDto'
import Papa from 'papaparse'

export const useMeasurementsStore = defineStore('measurements', () => {
  const localStorageKeyName = 'localMeasurements'
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>())

  function saveMeasurement(measurement: Measurement): void {
    state.value.set(measurement.id, measurement)

    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(Array.from(state.value.values()).map((m) => new MeasurementDto(m))),
    )
  }

  function deleteMeasurement(id: string | undefined): boolean {
    if (id) {
      try {
        state.value.delete(id)
        localStorage.removeItem(localStorageKeyName)
        Array.from(state.value.values()).forEach((m) => saveMeasurement(m))
        return true
      } catch {
        return false
      }
    } else {
      return false
    }
  }

  function clearMeasurements(): void {
    state.value.clear()

    localStorage.removeItem(localStorageKeyName)
  }

  function loadFromLocalStorage(localStorageContent: string): void {
    const dtos: unknown = JSON.parse(localStorageContent)
    if (!Array.isArray(dtos)) return

    dtos
      .map(toMeasurement)
      .filter((m) => m !== undefined)
      .forEach((m) => saveMeasurement(m))
  }

  function getMeasurementsAsCsv(): string {
    return Papa.unparse(Array.from(state.value.values()).map((m) => new MeasurementDto(m)))
  }

  const getAllMeasurements: ComputedRef<Measurement[]> = computed(() =>
    Array.from(state.value.values()),
  )

  const getMeasurement = computed(() => (id: string) => state.value.get(id))

  const size: ComputedRef<number> = computed(() => state.value.size)

  const localStorageContent: string | null = localStorage.getItem(localStorageKeyName)

  if (localStorageContent !== null && localStorageContent.length > 2) {
    loadFromLocalStorage(localStorageContent)
  }

  return {
    size,
    getAllMeasurements,
    saveMeasurement,
    clearMeasurements,
    getMeasurement,
    deleteMeasurement,
    getMeasurementsAsCsv,
  }
})
