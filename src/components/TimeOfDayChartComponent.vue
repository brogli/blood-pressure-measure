<script setup lang="ts">
import Chart from 'openvue/chart'
import Select from 'openvue/select'
import SelectButton from 'openvue/selectbutton'
import Panel from 'openvue/panel'
import Button from 'openvue/button'
import { useI18n } from 'vue-i18n'
import { useTimeOfDayChart } from '@/composables/timeOfDayChart'

const { t } = useI18n()

const {
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
} = useTimeOfDayChart()
</script>

<template>
  <section class="flex flex-col gap-4">
    <Panel :header="t('chart.timeOfDayTitle')">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div class="flex items-center gap-2">
          <label for="timeOfDayDayCount">{{ t('chart.dayCountLabel') }}</label>
          <Select
            v-model="selectedDayCount"
            :options="dayCountOptions"
            optionLabel="label"
            optionValue="value"
            inputId="timeOfDayDayCount"
          />
        </div>
        <div class="flex items-center gap-2">
          <Button
            icon="oi oi-chevron-left"
            severity="secondary"
            outlined
            :aria-label="t('chart.previousWindow')"
            @click="showPreviousWindow"
          />
          <span class="tabular-nums">{{ window.from }} – {{ window.to }}</span>
          <Button
            icon="oi oi-chevron-right"
            severity="secondary"
            outlined
            :disabled="windowOffset === 0"
            :aria-label="t('chart.nextWindow')"
            @click="showNextWindow"
          />
        </div>
        <div class="flex items-center gap-2">
          <span id="timeOfDayArmLabel">{{ t('chart.armLabel') }}</span>
          <SelectButton
            v-model="selectedArm"
            :options="armOptions"
            optionLabel="label"
            optionValue="value"
            :allowEmpty="false"
            aria-labelledby="timeOfDayArmLabel"
          />
        </div>
      </div>
    </Panel>
    <Panel>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </Panel>
  </section>
</template>
