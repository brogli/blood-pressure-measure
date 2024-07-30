<script setup lang="ts">

import { ref } from 'vue'
import InputNumber from 'primevue/inputnumber'
import SelectButton from 'primevue/selectbutton'
import { type ArmOption, Measurement } from '@/models/Measurement'
import Button from 'primevue/button'
import { useMeasurementsStore } from '@/stores/measurements'
import { useRouter } from 'vue-router'
import { DateWrapper } from '@/models/DateWrapper'
import Panel from 'primevue/panel';

const measurements = useMeasurementsStore()
const router = useRouter()

const systolic = ref(120)
const diastolic = ref(80)
const heartRate = ref(70)

const armSelectionValue = ref<ArmOption>('Left')
const armSelectionOptions = ref<ArmOption[]>(['Left', 'Right'])

function handleClick() {
  saveMeasurements()
}


function saveMeasurements() {
  const measurement = new Measurement(new DateWrapper(new Date()), systolic.value, diastolic.value, heartRate.value, armSelectionValue.value)
  measurements.addMeasurement(measurement)
  router.push('/')
}

</script>

<template>
  <Panel header="Add new measurement">
    <div>
      <div class="bp-form">
        <div class="bp-form-inputs">
          <div class="">
            <label for="systolic" class="font-bold"> Systolic </label>
            <InputNumber v-model="systolic" inputId="integeronly" fluid />
          </div>
          <div class="">
            <label for="diastolic" class="font-bold"> Diastolic </label>
            <InputNumber v-model="diastolic" inputId="diastolic" fluid />
          </div>
          <div class="">
            <label for="heartrate" class="font-bold"> Heart Rate </label>
            <InputNumber v-model="heartRate" inputId="heartrate" fluid />
          </div>
          <div class="">
            <label for="armSelection" class="font-bold">Which arm?</label>
            <SelectButton inputId="armSelection" v-model="armSelectionValue" :options="armSelectionOptions"
                          aria-labelledby="basic" />
          </div>
        </div>
        <div class="bp-form-buttons">
          <Button label="Save" @click="handleClick" />
          <Button label="Cancel" severity="secondary" as="router-link" to="/" />
        </div>
      </div>
    </div>
  </Panel>

</template>

<style scoped>

</style>