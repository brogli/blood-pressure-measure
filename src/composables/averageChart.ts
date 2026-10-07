import { computed, ref } from 'vue'
import { useMeasurementsStore } from '@/stores/measurements'
import type { Measurement } from '@/models/Measurement'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import type { ChartData, ChartOptions } from 'chart.js'
import { merge } from 'chart.js/helpers'
import { baseChartOptions, lineDataset, useChartTheme } from '@/composables/chartTheme'

export interface AverageChartConfig {
  groupKeyFn: (timestamp: Date) => string
  timeUnit: 'day' | 'week' | 'month' | 'year'
}

export function useAverageChart(config: AverageChartConfig) {
  const { t } = useI18n()
  const measurementStore = useMeasurementsStore()
  const theme = useChartTheme()

  const selectedTimeRange = ref<number | null>(6)

  const timeRangeOptions = computed(() => [
    { label: t('chart.timeRange1Month'), value: 1 },
    { label: t('chart.timeRange3Months'), value: 3 },
    { label: t('chart.timeRange6Months'), value: 6 },
    { label: t('chart.timeRange1Year'), value: 12 },
    { label: t('chart.timeRangeAll'), value: null },
  ])

  function computeAverages() {
    const allMeasurements = measurementStore.getAllMeasurements

    const cutoff =
      selectedTimeRange.value !== null
        ? dayjs().subtract(selectedTimeRange.value, 'month').toDate()
        : null

    const filtered = cutoff
      ? allMeasurements.filter((m: Measurement) => m.timestamp >= cutoff)
      : allMeasurements

    const grouped = new Map<string, Measurement[]>()
    for (const m of filtered) {
      const key = config.groupKeyFn(m.timestamp)
      const group = grouped.get(key)
      if (group) {
        group.push(m)
      } else {
        grouped.set(key, [m])
      }
    }

    const averages: {
      date: string
      systolic: number | null
      diastolic: number | null
      heartRate: number | null
    }[] = []
    for (const [date, measurements] of grouped) {
      averages.push({
        date,
        systolic: averageField(measurements, 'systolic'),
        diastolic: averageField(measurements, 'diastolic'),
        heartRate: averageField(measurements, 'heartRate'),
      })
    }

    averages.sort((a, b) => a.date.localeCompare(b.date))
    return averages
  }

  function averageField(
    measurements: Measurement[],
    field: 'systolic' | 'diastolic' | 'heartRate',
  ): number | null {
    const values = measurements
      .map((m) => Number(m[field]))
      .filter((v) => !Number.isNaN(v) && v !== 0)
    if (values.length === 0) return null
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
  }

  const averages = computed(() => computeAverages())

  const chartData = computed<ChartData<'line'>>(() => ({
    labels: averages.value.map((a) => a.date),
    datasets: [
      lineDataset(theme.value.token('cyan-500'), {
        label: t('measurement.systolic'),
        data: averages.value.map((a) => a.systolic),
      }),
      lineDataset(theme.value.token('gray-500'), {
        label: t('measurement.diastolic'),
        data: averages.value.map((a) => a.diastolic),
      }),
      lineDataset(theme.value.token('purple-500'), {
        label: t('measurement.heartRate'),
        data: averages.value.map((a) => a.heartRate),
      }),
    ],
  }))

  const chartOptions = computed<ChartOptions<'line'>>(() =>
    merge(baseChartOptions(theme.value, t), {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: config.timeUnit,
            displayFormats: { [config.timeUnit]: 'YYYY-MM-DD' },
            tooltipFormat: 'YYYY-MM-DD',
          },
        },
      },
    } satisfies ChartOptions<'line'>),
  )

  return { selectedTimeRange, timeRangeOptions, chartData, chartOptions }
}
