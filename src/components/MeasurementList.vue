<script setup lang="ts">
import DataTable, { type DataTableRowSelectEvent } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import Panel from "primevue/panel";
import { ref } from "vue";
import type { Measurement } from "@/models/Measurement";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useFileDialog, useFileSystemAccess } from "@vueuse/core";
import Papa from "papaparse";
import type { MeasurementDto } from "@/models/MeasurementDto";

const measurementsStore = useMeasurementsStore();
const currentSelection = ref();
const dataTableComponent = ref(null);
let exportFileName = getExportFileName();
let { isSupported, data, file, fileName, fileMIME, fileSize, fileLastModified, create, save, saveAs, updateData } =
  useFileSystemAccess({});

let fileContent: string;

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
  return `${dayjs().format("YYYY-MM-DD_HH-mm")}_blood-pressure-measurements.csv`;
}

function exportCSV(): void {
  dataTableComponent.value.exportCSV();
}

const { files, open, reset, onChange } = useFileDialog({
  accept: "text/csv",
});

onChange((files) => {
  const myFile = files?.item(0);
  const fileReader = new FileReader();
  fileReader.onload = () => {
    fileContent = fileReader.result as string;
    console.log(fileContent);
    parseCsv(fileContent);
  };
  fileReader.readAsText(myFile);
});

function parseCsv(text: string) {
  Papa.parse(text, { complete: dealWithCsvAsJson, header: true });
}

function dealWithCsvAsJson(results) {
  console.log("Parsing complete:", results);
  // results.data.forEach(item as MeasurementDto => {
  //   const measuremen
  // })
}

function prepareSaving() {
  const measurementsAsJson: string = localStorage.getItem("local");
  data.value = Papa.unparse(measurementsAsJson); // to csv
  saveAs({ suggestedName: getExportFileName() });
}
</script>

<template>
  <section class="measurement-list-root">
    <Panel header="Measurements">
      <div class="measurement-buttons-parent">
        <Button label="New" as="router-link" to="/new" />
        <Button label="Delete all" severity="danger" @click="deleteAllMeasurements" />
        <Button label="Export all" @click="prepareSaving()" />
        <Button label="Import" @click="open" />
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
          :export-filename="exportFileName"
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
