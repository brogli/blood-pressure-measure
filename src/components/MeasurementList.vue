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

const measurementsStore = useMeasurementsStore();
const currentSelection = ref();
const dataTableComponent = ref(null);

const router = useRouter();

function deleteAllMeasurements() {
  // TODO: trigger modal to ask user
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
  useImportfile().open();
}

function saveFile() {
  useExportFile(getExportFileName());
}
</script>

<template>
  <section class="measurement-list-root">
    <Panel header="Measurements">
      <div class="measurement-buttons-parent">
        <Button label="New" as="router-link" to="/new" />
        <Button label="Delete all" severity="danger" @click="deleteAllMeasurements" />
        <Button label="Export all" @click="saveFile()" />
        <Button label="Import" @click="openFile()" />
      </div>
    </Panel>

    <Panel v-if="measurementsStore.size">
      <div>
        <DataTable
          @rowSelect="onRowSelect"
          v-model:selection="currentSelection"
          stripedRows
          :value="measurementsStore.getAllMeasurements"
          selectionMode="single"
          data-key="id"
          ref="dataTableComponent"
        >
          <Column field="timestamp" sortable header="Created"></Column>
          <Column field="systolic" sortable header="Systolic"></Column>
          <Column field="diastolic" sortable header="Diastolic"></Column>
          <Column field="heartRate" sortable header="Heart Rate"></Column>
          <Column field="whichArm" sortable header="Which Arm?"></Column>
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
