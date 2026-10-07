<script setup lang="ts">
import Chart from 'openvue/chart'
import Select from 'openvue/select'
import Panel from 'openvue/panel'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import { useI18n } from 'vue-i18n'
import { useAverageChart, type AverageChartConfig } from '@/composables/averageChart'

const props = defineProps<{
  title: string
  inputId: string
  config: AverageChartConfig
}>()

const { t } = useI18n()

const { selectedTimeRange, timeRangeOptions, chartData, chartOptions } = useAverageChart(
  props.config,
)
</script>

<template>
  <section class="flex flex-col gap-4">
    <Panel :header="props.title">
      <label :for="props.inputId">{{ t('chart.timeRangeLabel') + ' ' }}</label>
      <Select
        v-model="selectedTimeRange"
        :options="timeRangeOptions"
        optionLabel="label"
        optionValue="value"
        :inputId="props.inputId"
      />
    </Panel>
    <Panel>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </Panel>
  </section>
</template>
