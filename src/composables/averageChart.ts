import { computed, ref, watch } from 'vue'
import { useMeasurementsStore } from '@/stores/measurements'
import type { Measurement } from '@/models/Measurement'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

export interface AverageChartConfig {
  groupKeyFn: (timestamp: Date) => string
  timeUnit: 'day' | 'week' | 'month' | 'year'
}

export function useAverageChart(config: AverageChartConfig) {
  const { t } = useI18n()
  const measurementStore = useMeasurementsStore()

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

  const chartData = ref()
  const chartOptions = ref()

  function updateChart() {
    const averages = computeAverages()
    const documentStyle = getComputedStyle(document.documentElement)

    chartData.value = {
      labels: averages.map((a) => a.date),
      datasets: [
        {
          label: t('measurement.systolic'),
          data: averages.map((a) => ({ x: a.date, y: a.systolic })),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          tension: 0.2,
          spanGaps: true,
        },
        {
          label: t('measurement.diastolic'),
          data: averages.map((a) => ({ x: a.date, y: a.diastolic })),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-gray-500'),
          tension: 0.2,
          spanGaps: true,
        },
        {
          label: t('measurement.heartRate'),
          data: averages.map((a) => ({ x: a.date, y: a.heartRate })),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-purple-500'),
          tension: 0.2,
          spanGaps: true,
        },
      ],
    }

    const textColor = documentStyle.getPropertyValue('--p-text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

    chartOptions.value = {
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: config.timeUnit,
            displayFormats: {
              [config.timeUnit]: 'YYYY-MM-DD',
            },
            tooltipFormat: 'YYYY-MM-DD',
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    }
  }

  watch(selectedTimeRange, () => updateChart())

  return {
    selectedTimeRange,
    timeRangeOptions,
    chartData,
    chartOptions,
    updateChart,
  }
}
