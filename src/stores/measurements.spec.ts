import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Measurement } from '@/models/Measurement'
import { useMeasurementsStore } from '@/stores/measurements'
import legacyCsv from '../../fixtures/legacy-export.csv?raw'

/** A fresh store reads localStorage again, like a page reload. */
function reloadStore() {
  setActivePinia(createPinia())
  return useMeasurementsStore()
}

const morning = new Measurement(new Date('2026-10-01T07:00:00Z'), 121, 79, 64, 'Left')
const evening = new Measurement(new Date('2026-10-01T19:30:00Z'), 133, 86, undefined, 'Right')
const readings = [morning, evening]

beforeEach(() => localStorage.clear())

describe('CSV export', () => {
  it('keeps the column header importable by older and newer versions', () => {
    const store = reloadStore()
    store.saveMeasurement(morning)
    expect(store.getMeasurementsAsCsv().split('\r\n')[0]).toBe(
      'id,timestampIso8601,systolic,diastolic,heartRate,whichArm',
    )
  })

  it('round-trips through import', () => {
    const store = reloadStore()
    readings.forEach((m) => store.saveMeasurement(m))
    const csv = store.getMeasurementsAsCsv()
    store.clearMeasurements()

    expect(store.importCsv(csv)).toBe(0)
    // the DTO writes 0 for missing numbers
    expect(store.getAllMeasurements).toEqual([morning, { ...evening, heartRate: 0 }])
  })
})

describe('CSV import', () => {
  it('imports every row of a legacy export', () => {
    const store = reloadStore()
    expect(store.importCsv(legacyCsv)).toBe(0)
    expect(store.size).toBe(4)
    expect(store.getMeasurement('0b9e2c3d-5f4a-4e6b-8c7d-2e3f4a5b6c71')).toMatchObject({
      systolic: 135,
      heartRate: undefined,
      whichArm: 'Left',
    })
  })

  it('does not duplicate rows when the same file is imported twice', () => {
    const store = reloadStore()
    store.importCsv(legacyCsv)
    store.importCsv(legacyCsv)
    expect(store.size).toBe(4)
  })

  it('keeps valid rows and counts the invalid ones', () => {
    const store = reloadStore()
    const csv = `${legacyCsv}x,not a date,1,2,3,Left\n`
    expect(store.importCsv(csv)).toBe(1)
    expect(store.size).toBe(4)
  })
})

describe('persistence', () => {
  it('restores saved measurements after a reload', () => {
    readings.forEach((m) => reloadStore().saveMeasurement(m))
    expect(reloadStore().getAllMeasurements.map((m) => m.id)).toEqual(readings.map((m) => m.id))
  })

  it('persists deletes', () => {
    const store = reloadStore()
    readings.forEach((m) => store.saveMeasurement(m))
    store.deleteMeasurement(morning.id)
    expect(reloadStore().getAllMeasurements.map((m) => m.id)).toEqual([evening.id])
  })

  it('backs up partly unreadable storage without rewriting it', () => {
    const stored = JSON.stringify([
      { timestampIso8601: morning.timestamp.toISOString() },
      { foo: 1 },
    ])
    localStorage.setItem('localMeasurements', stored)
    expect(reloadStore().size).toBe(1)
    expect(localStorage.getItem('localMeasurements')).toBe(stored)
    expect(localStorage.getItem('localMeasurementsCorrupt')).toBe(stored)
  })

  it('backs up unreadable storage instead of crashing', () => {
    localStorage.setItem('localMeasurements', '{broken')
    expect(reloadStore().size).toBe(0)
    expect(localStorage.getItem('localMeasurementsCorrupt')).toBe('{broken')
  })
})
