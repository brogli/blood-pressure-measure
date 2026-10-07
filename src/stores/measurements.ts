import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Measurement } from '@/models/Measurement'
import { MeasurementDto, toMeasurement } from '@/models/MeasurementDto'
import Papa from 'papaparse'

export const useMeasurementsStore = defineStore('measurements', () => {
  const localStorageKeyName = 'localMeasurements'
  const corruptBackupKeyName = 'localMeasurementsCorrupt'
  const state: Ref<Map<string, Measurement>> = ref(new Map<string, Measurement>())

  function saveMeasurement(measurement: Measurement): void {
    state.value.set(measurement.id, measurement)
    persist()
  }

  /** Adds every valid entry to the state, without persisting, and returns how many were rejected. */
  function addValid(entries: unknown[]): number {
    const measurements = entries.map(toMeasurement).filter((m) => m !== undefined)
    measurements.forEach((m) => state.value.set(m.id, m))
    return entries.length - measurements.length
  }

  function persist(): void {
    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(Array.from(state.value.values()).map((m) => new MeasurementDto(m))),
    )
  }

  function deleteMeasurement(id: string | undefined): boolean {
    if (id) {
      try {
        state.value.delete(id)
        persist()
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
    const entries = parseJsonArray(localStorageContent)
    if (entries && addValid(entries) === 0) return

    // keep the unreadable data, the next save overwrites it
    localStorage.setItem(corruptBackupKeyName, localStorageContent)
    console.error(`Unreadable measurements copied to localStorage key "${corruptBackupKeyName}"`)
  }

  /** Saves every valid row and returns how many rows were rejected. */
  function importCsv(csv: string): number {
    const rejectedRows = addValid(
      Papa.parse<unknown>(csv, { header: true, skipEmptyLines: true }).data,
    )
    persist()
    return rejectedRows
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
    importCsv,
  }
})

function parseJsonArray(text: string): unknown[] | undefined {
  try {
    const parsed: unknown = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}
