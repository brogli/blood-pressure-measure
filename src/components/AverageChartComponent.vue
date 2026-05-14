<script setup lang="ts">
import Chart from 'primevue/chart'
import Select from 'primevue/select'
import Panel from 'primevue/panel'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAverageChart, type AverageChartConfig } from '@/composables/averageChart'

const props = defineProps<{
  title: string
  inputId: string
  config: AverageChartConfig
}>()

const { t } = useI18n()

const { selectedTimeRange, timeRangeOptions, chartData, chartOptions, updateChart } =
  useAverageChart(props.config)

onMounted(() => updateChart())
</script>

<template>
  <section>
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

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
