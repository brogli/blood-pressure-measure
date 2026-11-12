<script setup lang="ts">
import Chart from 'openvue/chart'
import Select from 'openvue/select'
import Panel from 'openvue/panel'
import type { Chart as ChartJs } from 'chart.js'
import { computed, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useReadingsChart } from '@/composables/readingsChart'

const { t } = useI18n()

const {
  selectedWindowDays,
  windowDayOptions,
  totalHours,
  windowHours,
  view,
  chartData,
  chartOptions,
  plugins,
} = useReadingsChart()

// The canvas stays screen-wide and pinned; a wide empty track behind it gives native
// scrolling, and the scroll position picks the time range the chart shows.
const scroller = useTemplateRef<HTMLDivElement>('scroller')
const { width } = useElementSize(scroller)
const trackWidth = computed(() =>
  windowHours.value ? (width.value * totalHours.value) / windowHours.value : width.value,
)

let chart: ChartJs | undefined

// rtl: scrollLeft is 0 at the newest end and negative towards the past
function showScrolledRange(): void {
  if (!scroller.value || !width.value) return
  view.hoursBeforeEnd = (-scroller.value.scrollLeft / width.value) * windowHours.value
  chart?.update('none')
}

// a new width or window size changes the pixels per hour: keep showing the same time
watch(
  [width, windowHours, totalHours],
  () => {
    if (!scroller.value) return
    scroller.value.scrollLeft = (-view.hoursBeforeEnd * width.value) / (windowHours.value || 1)
    showScrolledRange()
  },
  { flush: 'post' },
)
</script>

<template>
  <section class="flex flex-col gap-4">
    <Panel :header="t('chart.readingsTitle')">
      <label for="readingsWindow">{{ t('chart.windowLabel') + ' ' }}</label>
      <Select
        v-model="selectedWindowDays"
        :options="windowDayOptions"
        optionLabel="label"
        optionValue="value"
        inputId="readingsWindow"
      />
    </Panel>
    <Panel>
      <div
        ref="scroller"
        dir="rtl"
        class="overflow-x-auto"
        data-testid="readings-scroller"
        @scroll.passive="showScrolledRange"
      >
        <div class="h-80 portrait:h-[60svh]" :style="{ width: `${trackWidth}px` }">
          <div dir="ltr" class="sticky right-0 h-full" :style="{ width: `${width}px` }">
            <Chart
              type="line"
              :data="chartData"
              :options="chartOptions"
              :plugins="plugins"
              class="h-full"
              @loaded="(loaded: ChartJs) => (chart = loaded)"
            />
          </div>
        </div>
      </div>
    </Panel>
  </section>
</template>
