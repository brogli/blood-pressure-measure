<script setup lang="ts">
import { ref } from "vue";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import { type ArmOption, Measurement } from "@/models/Measurement";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import { useRouter } from "vue-router";
import { DateWrapper } from "@/models/DateWrapper";
import Panel from "primevue/panel";
import DatePicker from "primevue/datepicker";

const measurementStore = useMeasurementsStore();
const router = useRouter();

const currentMeasurement = ref<Measurement>(new Measurement(new DateWrapper(new Date()), 0, 0, 0, "Left"));

const armSelectionOptions = ref<ArmOption[]>(["Left", "Right"]);

const props = defineProps<{
  id?: string;
}>();

function handleClick() {
  saveMeasurement();
}

function saveMeasurement() {
  measurementStore.saveMeasurement(currentMeasurement.value);
  router.push("/");
}

function loadMeasurement(id: string) {
  currentMeasurement.value = measurementStore.getMeasurement(id);
}

const isInEditmode = props.id != undefined;
const header = isInEditmode ? "Edit new measurement" : "Add new measurement";

if (isInEditmode) {
  loadMeasurement(props.id);
}
</script>

<template>
  <Panel :header="header">
    <div>
      <div class="bp-form">
        <div class="bp-form-inputs">
          <div class="">
            <label for="timestamp" class="font-bold"> Created at </label>
            <DatePicker
              id="datepicker-24h"
              v-model="currentMeasurement.timestamp.nativeTimeStamp"
              showTime
              hourFormat="24"
              fluid
            />
          </div>
          <div class="">
            <label for="systolic" class="font-bold"> Systolic </label>
            <InputNumber v-model="currentMeasurement.systolic" v-focustrap inputId="systolic" fluid />
          </div>
          <div class="">
            <label for="diastolic" class="font-bold"> Diastolic </label>
            <InputNumber v-model="currentMeasurement.diastolic" inputId="diastolic" fluid />
          </div>
          <div class="">
            <label for="heartrate" class="font-bold"> Heart Rate </label>
            <InputNumber v-model="currentMeasurement.heartRate" inputId="heartrate" fluid />
          </div>
          <div class="">
            <label for="armSelection" class="font-bold">Which arm?</label>
            <SelectButton
              inputId="armSelection"
              v-model="currentMeasurement.whichArm"
              :options="armSelectionOptions"
              aria-labelledby="basic"
              id="armSelectButton"
            />
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
#armSelectButton {
  display: flex;
}
</style>
