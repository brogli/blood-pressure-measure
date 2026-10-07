import { computed, ref, type ComputedRef, type Ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import type { ChartData, ChartOptions, Point } from 'chart.js'
import { merge } from 'chart.js/helpers'
import { useMeasurementsStore } from '@/stores/measurements'
import type { ArmOption, Measurement } from '@/models/Measurement'
import { baseChartOptions, lineDataset, useChartTheme } from '@/composables/chartTheme'

export interface DayReading {
  hour: number
  systolic: number | undefined
  diastolic: number | undefined
  arm: ArmOption
}

export interface DaySeries {
  date: string
  readings: DayReading[]
}

export interface DayWindow {
  from: string
  to: string
}

const DATE_FORMAT = 'YYYY-MM-DD'

/** Calendar-day window (inclusive, 'YYYY-MM-DD'): `offset` 0 ends today, 1 is the window before that, ... */
export function dayWindow(dayCount: number, offset: number, today: Date = new Date()): DayWindow {
  const to = dayjs(today).subtract(offset * dayCount, 'day')
  return { from: to.subtract(dayCount - 1, 'day').format(DATE_FORMAT), to: to.format(DATE_FORMAT) }
}

/** Days inside the window that have readings, oldest first; readings sorted by time. */
export function daySeriesInWindow(measurements: Measurement[], window: DayWindow): DaySeries[] {
  const start = dayjs(window.from).startOf('day').toDate()
  const end = dayjs(window.to).endOf('day').toDate()
  const inWindow = measurements
    .filter((m) => m.timestamp >= start && m.timestamp <= end)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  // chronological insertion keeps the map in date order
  const byDay = new Map<string, DayReading[]>()
  for (const measurement of inWindow) {
    const date = dayjs(measurement.timestamp).format(DATE_FORMAT)
    const readings = byDay.get(date) ?? []
    readings.push(toReading(measurement))
    byDay.set(date, readings)
  }
  return [...byDay].map(([date, readings]) => ({ date, readings }))
}

function toReading(measurement: Measurement): DayReading {
  const time = dayjs(measurement.timestamp)
  return {
    hour: time.hour() + time.minute() / 60,
    systolic: presentValue(measurement.systolic),
    diastolic: presentValue(measurement.diastolic),
    arm: measurement.whichArm,
  }
}

/** `0` marks a missing value in legacy CSV data; imported fields may still be strings. */
function presentValue(value: number | undefined): number | undefined {
  return Number(value) || undefined
}

type Metric = (typeof METRICS)[number]

/** Readings without this metric are left out; `spanGaps` keeps the line continuous. */
function points(readings: DayReading[], metric: Metric): Point[] {
  return readings.flatMap((r) => {
    const y = r[metric]
    return y === undefined ? [] : [{ x: r.hour, y }]
  })
}

export function formatHour(hour: number): string {
  const minutes = Math.round(hour * 60)
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0')
  const mm = String(minutes % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

const DAY_COUNT_OPTIONS = [3, 5, 7, 14]
const METRICS = ['systolic', 'diastolic'] as const

// Lightness by day age: the further in the past, the darker the line, in both themes.
// Dark mode uses a lighter window of the same hue so the oldest line keeps contrast on the dark surface.
const SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const RAMP_LENGTH = 7
const LIGHT_RAMP = SHADES.slice(-RAMP_LENGTH)
const DARK_RAMP = SHADES.slice(0, RAMP_LENGTH)

interface SelectOption<T> {
  label: string
  value: T
}

export interface TimeOfDayChart {
  selectedDayCount: Ref<number>
  dayCountOptions: ComputedRef<SelectOption<number>[]>
  selectedArm: Ref<ArmOption>
  armOptions: ComputedRef<SelectOption<ArmOption>[]>
  window: ComputedRef<DayWindow>
  windowOffset: Ref<number>
  showPreviousWindow: () => void
  showNextWindow: () => void
  chartData: ComputedRef<ChartData<'line'>>
  chartOptions: ComputedRef<ChartOptions<'line'>>
}

export function useTimeOfDayChart(): TimeOfDayChart {
  const { t } = useI18n()
  const measurementStore = useMeasurementsStore()
  const theme = useChartTheme()

  const selectedDayCount = ref<number>(7)
  const selectedArm = ref<ArmOption>('Left')
  const windowOffset = ref<number>(0)

  const window = computed(() => dayWindow(selectedDayCount.value, windowOffset.value))

  function showPreviousWindow(): void {
    windowOffset.value += 1
  }

  function showNextWindow(): void {
    windowOffset.value = Math.max(0, windowOffset.value - 1)
  }

  const dayCountOptions = computed(() =>
    DAY_COUNT_OPTIONS.map((n) => ({ label: t('chart.lastNDays', { n }), value: n })),
  )

  const armOptions = computed<SelectOption<ArmOption>[]>(() => [
    { label: t('measurement.left'), value: 'Left' },
    { label: t('measurement.right'), value: 'Right' },
  ])

  /** `age` runs from 0 (newest shown day) to 1 (oldest), so the whole ramp is used however many days are shown. */
  function dayColor(age: number): string {
    const ramp = theme.value.isDark ? DARK_RAMP : LIGHT_RAMP
    const shade = ramp[Math.round(age * (ramp.length - 1))]
    return theme.value.token(`cyan-${shade}`)
  }

  /** One dataset per metric; the legend and tooltip rely on this grouping. */
  function datasetsForDay(day: DaySeries, age: number) {
    const readings = day.readings.filter((r) => r.arm === selectedArm.value)
    if (readings.length === 0) return []
    const color = dayColor(age)
    return METRICS.map((metric) =>
      lineDataset(color, {
        label: day.date,
        data: points(readings, metric),
        borderDash: metric === 'diastolic' ? [6, 4] : [],
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }),
    )
  }

  const chartData = computed<ChartData<'line'>>(() => {
    const series = daySeriesInWindow(measurementStore.getAllMeasurements, window.value)
    const oldest = Math.max(1, series.length - 1)
    return {
      datasets: series.flatMap((day, index) =>
        datasetsForDay(day, (series.length - 1 - index) / oldest),
      ),
    }
  })

  const chartOptions = computed<ChartOptions<'line'>>(() =>
    merge(baseChartOptions(theme.value, t), {
      plugins: {
        legend: {
          labels: { filter: (item) => (item.datasetIndex ?? 0) % METRICS.length === 0 },
          // toggle the whole day: its datasets form one METRICS-sized group
          onClick: (_event, item, legend) => {
            const first = item.datasetIndex ?? 0
            for (let i = first; i < first + METRICS.length; i++) {
              legend.chart.setDatasetVisibility(i, !legend.chart.isDatasetVisible(i))
            }
            legend.chart.update()
          },
        },
        tooltip: {
          callbacks: {
            title: (items) =>
              items[0] ? `${items[0].dataset.label} ${formatHour(Number(items[0].parsed.x))}` : '',
            label: (item) =>
              `${t(`measurement.${METRICS[item.datasetIndex % METRICS.length]}`)}: ${item.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 24,
          ticks: { stepSize: 3, callback: (value) => formatHour(Number(value)) },
        },
      },
    } satisfies ChartOptions<'line'>),
  )

  return {
    selectedDayCount,
    dayCountOptions,
    selectedArm,
    armOptions,
    window,
    windowOffset,
    showPreviousWindow,
    showNextWindow,
    chartData,
    chartOptions,
  }
}
