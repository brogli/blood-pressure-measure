<script setup lang="ts">
import AverageChartComponent from '@/components/AverageChartComponent.vue'
import TimeOfDayChartComponent from '@/components/TimeOfDayChartComponent.vue'
import type { AverageChartConfig } from '@/composables/averageChart'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// weeks start on Monday
dayjs.extend(isoWeek)

const dailyConfig: AverageChartConfig = {
  groupKeyFn: (timestamp) => dayjs(timestamp).format('YYYY-MM-DD'),
  timeUnit: 'day',
}

const weeklyConfig: AverageChartConfig = {
  groupKeyFn: (timestamp) => dayjs(timestamp).startOf('isoWeek').format('YYYY-MM-DD'),
  timeUnit: 'week',
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <TimeOfDayChartComponent />
    <AverageChartComponent
      :title="t('chart.dailyAverageTitle')"
      input-id="dailyTimeRange"
      :config="dailyConfig"
    />
    <AverageChartComponent
      :title="t('chart.weeklyAverageTitle')"
      input-id="weeklyTimeRange"
      :config="weeklyConfig"
    />
  </div>
</template>
