<script setup lang="ts">
import { computed, ref } from "vue";
import InputNumber from "primevue/inputnumber";
import SelectButton from "primevue/selectbutton";
import { type ArmOption, Measurement } from "@/models/Measurement";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import { useRouter } from "vue-router";
import Panel from "primevue/panel";
import DatePicker from "primevue/datepicker";
import Divider from "primevue/divider";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useToastStore } from "@/stores/toastStore";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const measurementStore = useMeasurementsStore();
const router = useRouter();
const { t } = useI18n();
const { currentToast } = storeToRefs(useToastStore());
const confirm = useConfirm();

const currentMeasurement = ref<Measurement>(new Measurement(new Date(), undefined, undefined, undefined, "Left"));

const armSelectionOptions = ref<ArmOption[]>(["Left", "Right"]);

const props = defineProps<{
  id?: string;
}>();

function handleSaveClick() {
  saveMeasurement();
}

function confirmDelete() {
  confirm.require({
    message: t("measurementForm.confirmDeleteText"),
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: t("measurementForm.cancelButton"),
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: t("measurementForm.deleteButton"),
      severity: "danger",
    },
    accept: () => {
      continueDelete();
    },
    reject: () => {},
  });
}

function handleDeleteClick() {
  confirmDelete();
}

function continueDelete() {
  const isSuccessful = measurementStore.deleteMeasurement(props.id);
  if (isSuccessful) {
    currentToast.value = {
      severity: "success",
      summary: t("common.success"),
      detail: t("toasts.successfullyDeletedMeasurement"),
      life: 3000,
    };
    router.push({ name: "home" });
  } else {
    currentToast.value = {
      severity: "error",
      summary: t("common.error"),
      detail: t("toasts.errorWhileDeletingMeasurement"),
      life: 3000,
    };
  }
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
    currentToast.value = {
      severity: "error",
      summary: "Error",
      detail: t("toasts.errorWhileLoadingMeasurement"),
      life: 3000,
    };
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
    <ConfirmDialog></ConfirmDialog>
    <div class="bp-form">
      <div class="bp-form--text-inputs-container">
        <div class="bp-form-inputs-item-text">
          <label for="timestamp" class="font-bold">{{ t("measurement.createdAt") }}</label>
          <DatePicker
            showIcon
            id="datepicker-24h"
            v-model="currentMeasurement.timestamp"
            showTime
            hourFormat="24"
            fluid
          />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="systolic">{{ t("measurement.systolic") }}</label>
          <InputNumber placeholder="120" v-model="currentMeasurement.systolic" v-focustrap inputId="systolic" fluid />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="diastolic">{{ t("measurement.diastolic") }}</label>
          <InputNumber placeholder="80" v-model="currentMeasurement.diastolic" inputId="diastolic" fluid />
        </div>
        <div class="bp-form-inputs-item-text">
          <label for="heartrate">{{ t("measurement.heartRate") }}</label>
          <InputNumber placeholder="80" v-model="currentMeasurement.heartRate" inputId="heartrate" fluid />
        </div>
        <div class="">
          <label for="armSelection">{{ t("measurement.whichArm") }}</label>
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
