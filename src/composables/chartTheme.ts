import { computed, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { Chart, type ChartDataset, type ChartOptions } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useAppSettingsStore } from '@/stores/appSettings'
import { limitLineAnnotations } from '@/functions/chartLimits'

// The plugin merges its defaults only when registered on the Chart class, not when passed per chart.
Chart.register(annotationPlugin)

export interface ChartTheme {
  isDark: boolean
  text: string
  muted: string
  border: string
  limit: string
  /** Resolves an OpenVue palette token such as `cyan-500`. */
  token: (name: string) => string
}

/** Theme colors read from OpenVue's CSS tokens; re-read whenever the color scheme flips. */
export function useChartTheme(): ComputedRef<ChartTheme> {
  const { isDarkModeActive } = storeToRefs(useAppSettingsStore())
  return computed(() => readChartTheme(isDarkModeActive.value))
}

function readChartTheme(isDark: boolean): ChartTheme {
  const style = getComputedStyle(document.documentElement)
  const token = (name: string): string => style.getPropertyValue(`--p-${name}`)
  return {
    isDark,
    text: token('text-color'),
    muted: token('text-muted-color'),
    border: token('content-border-color'),
    limit: token('red-400'),
    token,
  }
}

type Translate = (key: string) => string

/** Options shared by all line charts: size, limit lines, themed legend and axes. */
export function baseChartOptions(theme: ChartTheme, t: Translate): ChartOptions<'line'> {
  // one object per scale: chart.js' merge writes chart-specific options into them
  const axis = () => ({ ticks: { color: theme.muted }, grid: { color: theme.border } })
  return {
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      annotation: { annotations: limitLineAnnotations(t, theme.limit) },
      legend: { labels: { color: theme.text } },
    },
    scales: { x: axis(), y: axis() },
  }
}

/** A single-colored line; the OpenVue wrapper otherwise fills point colors from its own palette. */
export function lineDataset<TData>(
  color: string,
  dataset: ChartDataset<'line', TData>,
): ChartDataset<'line', TData> {
  return {
    borderColor: color,
    backgroundColor: color,
    pointBackgroundColor: color,
    pointBorderColor: color,
    tension: 0.2,
    spanGaps: true,
    ...dataset,
  }
}
