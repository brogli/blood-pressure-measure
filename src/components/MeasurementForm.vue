<script setup lang="ts">
import { computed, ref } from "vue";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import { type ArmOption, Measurement } from "@/models/Measurement";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import { useRouter } from "vue-router";
import { DateWrapper } from "@/models/DateWrapper";
import Panel from "primevue/panel";
import DatePicker from "primevue/datepicker";
import Divider from "primevue/divider";
import { useI18n } from "vue-i18n";

const measurementStore = useMeasurementsStore();
const router = useRouter();
const { t } = useI18n();

const currentMeasurement = ref<Measurement>(new Measurement(new DateWrapper(new Date()), 0, 0, 0, "Left"));

const armSelectionOptions = ref<ArmOption[]>(["Left", "Right"]);

const props = defineProps<{
  id?: string;
}>();

function handleSaveClick() {
  saveMeasurement();
}

function handleDeleteClick() {
  // TODO: warn user with modal

  measurementStore.deleteMeasurement(props.id);
  router.push({ name: "home" });
}

function saveMeasurement() {
  measurementStore.saveMeasurement(currentMeasurement.value);
  router.push({ name: "home" });
}

function loadMeasurement(id: string) {
  const clone: Measurement | undefined = measurementStore.getMeasurement(id)?.getClone();
  if (clone) {
    currentMeasurement.value = clone;
  } else {
    // TODO: show error
  }
}

function getLeftRightLabel(arm: ArmOption): string {
  if (arm === "Left") {
    return t("measurement.left");
  } else {
    return t("measurement.right");
  }
}

const isInEditmode = props.id != undefined;
const header = computed(() =>
  isInEditmode ? t("measurementForm.editMeasurement") : t("measurementForm.addMeasurement"),
);

if (isInEditmode) {
  loadMeasurement(props.id);
}
</script>

<template>
  <Panel :header="header">
    <div class="bp-form">
      <div class="bp-form--text-inputs-container">
        <div class="bp-form-inputs-item-text">
          <label for="timestamp" class="font-bold">{{ t("measurement.createdAt") }}</label>
          <DatePicker
            showIcon
            id="datepicker-24h"
            v-model="currentMeasurement.timestamp.nativeTimeStamp"
            showTime
            hourFormat="24"
            fluid
          />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="systolic" class="font-bold">{{ t("measurement.systolic") }}</label>
          <InputNumber v-model="currentMeasurement.systolic" v-focustrap inputId="systolic" fluid />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="diastolic" class="font-bold">{{ t("measurement.diastolic") }}</label>
          <InputNumber v-model="currentMeasurement.diastolic" inputId="diastolic" fluid />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="heartrate" class="font-bold">{{ t("measurement.heartRate") }}</label>
          <InputNumber v-model="currentMeasurement.heartRate" inputId="heartrate" fluid />
        </div>
        <div class="">
          <label for="armSelection" class="font-bold">{{ t("measurement.whichArm") }}</label>
          <SelectButton
            inputId="armSelection"
            v-model="currentMeasurement.whichArm"
            :options="armSelectionOptions"
            :option-label="getLeftRightLabel"
            aria-labelledby="basic"
            id="armSelectButton"
          />
        </div>
      </div>
    </div>

    <Divider />
    <div class="bp-form-buttons">
      <div class="bp-form-buttons-save-cancel">
        <Button :label="t('measurementForm.saveButton')" @click="handleSaveClick" />
        <Button :label="t('measurementForm.cancelButton')" severity="secondary" as="router-link" to="/" />
      </div>
      <div>
        <Button
          v-if="isInEditmode"
          :label="t('measurementForm.deleteButton')"
          severity="danger"
          @click="handleDeleteClick"
        />
      </div>
    </div>
  </Panel>
</template>

<style scoped>
#armSelectButton {
  display: flex;
}
</style>
