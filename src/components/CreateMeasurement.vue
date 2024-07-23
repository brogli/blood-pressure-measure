<script setup lang="ts">

import { ref } from "vue";
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';

const systolic = ref(42723);
const diastolic = ref(2351.35);
const heartRate = ref(50);

const armSelectionValue = ref('Left');
const armSelectionOptions = ref(['Left', 'Right']);

</script>

<template>
  <div class="bp-form">
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
      <label for="armSelection" class="font-bold"> Heart Rate </label>
      <SelectButton inputId="armSelection" v-model="armSelectionValue" :options="armSelectionOptions" aria-labelledby="basic" />
    </div>
  </div>
  <div>

  </div>
</template>

<style scoped>

</style>