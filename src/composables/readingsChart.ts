import { computed, ref, type ComputedRef, type Ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import type { ChartData, ChartOptions, Point } from 'chart.js'
import type { AnnotationOptions } from 'chartjs-plugin-annotation'
import { merge } from 'chart.js/helpers'
import { useMeasurementsStore } from '@/stores/measurements'
import { presentValue, type ArmOption, type Measurement } from '@/models/Measurement'
import {
  baseChartOptions,
  lineDataset,
  useChartTheme,
  type SelectOption,
} from '@/composables/chartTheme'

/** A stretch of real time shown on the x axis; `offset` is where it starts on the axis, in hours. */
export interface Segment {
  start: number
  end: number
  offset: number
}

const HOUR_MS = 3_600_000
/** Each reading gets ±1h of axis; time between readings further apart is left out. */
const MARGIN_MS = HOUR_MS

const lengthHours = (s: Segment): number => (s.end - s.start) / HOUR_MS
const WINDOW_DAY_OPTIONS = [2, 3, 7]

/** Windows of ±1h around each timestamp (epoch ms), overlapping ones merged, laid out back to back. */
export function toSegments(timestamps: number[]): Segment[] {
  const segments: Segment[] = []
  for (const time of [...timestamps].sort((a, b) => a - b)) {
    const last = segments[segments.length - 1]
    if (last && time - MARGIN_MS <= last.end) {
      last.end = time + MARGIN_MS
    } else {
      const offset = last ? last.offset + lengthHours(last) : 0
      segments.push({ start: time - MARGIN_MS, end: time + MARGIN_MS, offset })
    }
  }
  return segments
}

export function axisLength(segments: Segment[]): number {
  const last = segments[segments.length - 1]
  return last ? last.offset + lengthHours(last) : 0
}

/** Axis position (hours) of a time inside one of the segments. */
export function toAxis(segments: Segment[], time: number): number {
  const segment = segments.find((s) => time <= s.end) ?? segments[segments.length - 1]
  return segment ? segment.offset + (time - segment.start) / HOUR_MS : 0
}

/** Real time (epoch ms) of an axis position; inverse of `toAxis`. */
export function toTime(segments: Segment[], x: number): number {
  const next = segments.findIndex((s) => s.offset > x)
  const segment = segments[(next === -1 ? segments.length : next) - 1] ?? segments[0]
  return segment ? segment.start + (x - segment.offset) * HOUR_MS : 0
}

/** Axis position of each segment's middle: one tick per measuring session. */
export function segmentTicks(segments: Segment[]): number[] {
  return segments.map((s) => s.offset + lengthHours(s) / 2)
}

/** Axis positions where a calendar day begins: a segment that starts a new day, or a midnight inside one. */
export function dayMarks(segments: Segment[]): number[] {
  return segments.flatMap((s, i) => {
    const previous = segments[i - 1]
    const marks = previous && dayjs(previous.end).isSame(s.start, 'day') ? [] : [s.offset]
    for (
      let d = dayjs(s.start).add(1, 'day').startOf('day');
      d.valueOf() <= s.end;
      d = d.add(1, 'day')
    ) {
      marks.push(toAxis([s], d.valueOf()))
    }
    return marks
  })
}

type Metric = 'systolic' | 'diastolic'

export function readingPoints(
  measurements: Measurement[],
  segments: Segment[],
  metric: Metric,
  arm: ArmOption,
): Point[] {
  return measurements.flatMap((m) => {
    const y = presentValue(m[metric])
    if (m.whichArm !== arm || y === undefined) return []
    return [{ x: toAxis(segments, m.timestamp.getTime()), y }]
  })
}

const SERIES = [
  { metric: 'systolic', arm: 'Left' },
  { metric: 'systolic', arm: 'Right' },
  { metric: 'diastolic', arm: 'Left' },
  { metric: 'diastolic', arm: 'Right' },
] as const satisfies { metric: Metric; arm: ArmOption }[]

export interface ReadingsChart {
  selectedWindowDays: Ref<number>
  windowDayOptions: ComputedRef<SelectOption<number>[]>
  /** Axis hours of all readings, and of the part that fits on screen. */
  totalHours: ComputedRef<number>
  windowHours: ComputedRef<number>
  /** How far (in axis hours) the visible part ends before the newest reading; read on each chart update. */
  view: { hoursBeforeEnd: number }
  chartData: ComputedRef<ChartData<'line'>>
  chartOptions: ComputedRef<ChartOptions<'line'>>
}

export function useReadingsChart(): ReadingsChart {
  const { t } = useI18n()
  const measurementStore = useMeasurementsStore()
  const theme = useChartTheme()

  const selectedWindowDays = ref<number>(3)
  const windowDayOptions = computed(() =>
    WINDOW_DAY_OPTIONS.map((n) => ({ label: t('chart.nDays', { n }), value: n })),
  )

  const measurements = computed(() => measurementStore.getAllMeasurements)
  const segments = computed(() => toSegments(measurements.value.map((m) => m.timestamp.getTime())))
  const total = computed(() => axisLength(segments.value))
  const ticks = computed(() => segmentTicks(segments.value))
  const dayCount = computed(
    () => new Set(measurements.value.map((m) => m.timestamp.toDateString())).size,
  )
  /** The selected number of days, measured in average axis hours per day. */
  const windowHours = computed(() =>
    dayCount.value <= selectedWindowDays.value
      ? total.value
      : (total.value * selectedWindowDays.value) / dayCount.value,
  )

  // deliberately not reactive: scrolling updates the chart in place instead of rebuilding its options
  const view = { hoursBeforeEnd: 0 }

  const chartData = computed<ChartData<'line'>>(() => ({
    datasets: SERIES.map(({ metric, arm }) =>
      lineDataset(theme.value.token(metric === 'systolic' ? 'cyan-500' : 'gray-500'), {
        label: `${t(`measurement.${metric}`)} (${t(`measurement.${arm.toLowerCase()}`)})`,
        data: readingPoints(measurements.value, segments.value, metric, arm),
        showLine: false,
        pointStyle: arm === 'Left' ? 'circle' : 'triangle',
        pointRadius: 5,
        pointHoverRadius: 7,
      }),
    ),
  }))
  /** Dashed lines where time was left out, solid ones where a calendar day begins. */
  function dayAnnotations(): Record<string, AnnotationOptions> {
    const line = (x: number, color: string, dash: number[] = []): AnnotationOptions => ({
      type: 'line',
      xMin: x,
      xMax: x,
      borderColor: color,
      borderWidth: 1,
      borderDash: dash,
    })
    const days = dayMarks(segments.value)
    const gaps = segments.value.map((s) => s.offset).filter((x) => x > 0 && !days.includes(x))
    const lines = [
      ...gaps.map((x) => line(x, theme.value.border, [4, 4])),
      ...days.map((x) => line(x, theme.value.muted)),
    ]
    return Object.fromEntries(lines.map((a, i) => [`day${i}`, a]))
  }

  const formatAxis = (x: number, format: string): string =>
    dayjs(toTime(segments.value, x)).format(format)

  const chartOptions = computed<ChartOptions<'line'>>(() =>
    merge(baseChartOptions(theme.value, t), {
      plugins: {
        annotation: {
          annotations: dayAnnotations(),
        },
        legend: { labels: { usePointStyle: true } },
        tooltip: {
          callbacks: {
            title: (items) =>
              items[0] ? formatAxis(items[0].parsed.x ?? 0, 'YYYY-MM-DD HH:mm') : '',
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          // keep exactly the scrolled range instead of widening it to round tick values
          bounds: 'data',
          afterDataLimits: (axis) => {
            if (!windowHours.value) return // no readings: keep chart.js' default range
            axis.max = total.value - view.hoursBeforeEnd
            axis.min = axis.max - windowHours.value
          },
          afterBuildTicks: (axis) => {
            axis.ticks = ticks.value
              .filter((value) => value >= axis.min && value <= axis.max)
              .map((value) => ({ value }))
          },
          ticks: {
            maxRotation: 0,
            // the first tick of each calendar day also shows its date
            callback: (value, index, ticks) => {
              const time = toTime(segments.value, Number(value))
              const previous = ticks[index - 1]
              const newDay =
                !previous || !dayjs(toTime(segments.value, previous.value)).isSame(time, 'day')
              const hour = dayjs(time).format('HH:mm')
              return newDay ? [hour, dayjs(time).format('DD.MM.')] : hour
            },
          },
        },
      },
    } satisfies ChartOptions<'line'>),
  )

  return {
    selectedWindowDays,
    windowDayOptions,
    totalHours: total,
    windowHours,
    view,
    chartData,
    chartOptions,
  }
}
