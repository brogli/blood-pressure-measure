<script setup lang="ts">
import DataTable, { type DataTableRowSelectEvent } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import Panel from "primevue/panel";
import { ref } from "vue";
import { Measurement } from "@/models/Measurement";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useExportFile } from "@/composables/exportFile";
import { useImportfile } from "@/composables/importFile";
import { useShare } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
const confirm = useConfirm();

const measurementsStore = useMeasurementsStore();
const { t } = useI18n();
const router = useRouter();
const { share, isSupported } = useShare();

const currentSelection = ref();

function deleteAllMeasurements() {
  confirm.require({
    message: t("measurementList.confirmDeleteText"),
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
      continueDeletingAllMeasurements();
    },
    reject: () => {},
  });
}

function continueDeletingAllMeasurements() {
  measurementsStore.clearMeasurements();
}

function onRowSelect(event: DataTableRowSelectEvent) {
  const selectedMeasurement = event.data as Measurement;
  router.push({ name: "edit", params: { id: selectedMeasurement.id } });
}

function getExportFileName(): string {
  return `${dayjs().format("YYYY-MM-DD_HH-mm-ss")}_blood-pressure-measurements.csv`;
}

function openFile(): void {
  useImportfile(t).open();
}

function saveFile() {
  useExportFile(getExportFileName());
}

function shareAsCsv() {
  const blob = new Blob([measurementsStore.getMeasurementsAsCsv()], { type: "text/csv" });
  share({ title: "world", files: [new File([blob], getExportFileName(), { type: "text/csv" })] });
}
</script>

<template>
  <section class="measurement-list-root">
    <Panel :header="t('measurementList.title')">
      <ConfirmDialog></ConfirmDialog>
      <div class="measurement-buttons-parent">
        <Button :label="t('measurementList.actions.createNew')" as="router-link" to="/new" />
        <Button
          :label="t('measurementList.actions.export')"
          @click="saveFile()"
          :disabled="measurementsStore.size <= 0"
        />
        <Button :label="t('measurementList.actions.import')" @click="openFile()" />
        <Button
          :label="t('measurementList.actions.share')"
          @click="shareAsCsv()"
          :disabled="!isSupported || measurementsStore.size <= 0"
          v-tooltip.top="!isSupported ? t('measurementList.actions.notSupportedByBrowser') : ''"
        />
        <Button
          :label="t('measurementList.actions.deleteAll')"
          severity="danger"
          @click="deleteAllMeasurements"
          :disabled="measurementsStore.size <= 0"
        />
      </div>
    </Panel>

    <Panel v-if="measurementsStore.size > 0">
      <div>
        <DataTable
          @rowSelect="onRowSelect"
          v-model:selection="currentSelection"
          stripedRows
          :value="measurementsStore.getAllMeasurements"
          selectionMode="single"
          data-key="id"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column field="timestamp" sortable :header="t('measurement.createdAt')"></Column>
          <Column field="systolic" sortable :header="t('measurement.systolic')"></Column>
          <Column field="diastolic" sortable :header="t('measurement.diastolic')"></Column>
          <Column field="heartRate" sortable :header="t('measurement.heartRate')"></Column>
          <Column field="whichArm" sortable :header="t('measurement.whichArm')"></Column>
        </DataTable>
      </div>
    </Panel>
  </section>
</template>

<style scoped>
.measurement-buttons-parent {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1rem;
}

.measurement-list-root {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
</style>
