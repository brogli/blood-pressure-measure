<script setup lang="ts">
import DataTable, { type DataTableRowSelectEvent } from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import Panel from 'primevue/panel';import { ref } from "vue";
import type { Measurement } from "@/models/Measurement";

const measurementsStore = useMeasurementsStore();
const selectedMeasurement = ref();

function deleteAllMeasurements() {
  // TODO: trigger modal to ask user
  measurementsStore.clearMeasurements();
}

function onRowSelect(event: DataTableRowSelectEvent) {
  const seletctedMeasuremtent = event.data as Measurement;
  console.log(seletctedMeasuremtent.id);
}
</script>

<template>
<section class="measurement-list-root">
  <Panel header="Measurements">
      <div class="measurement-buttons-parent">
        <Button label="New" as="router-link" to="/new" />
        <Button label="Delete all" severity="danger" @click="deleteAllMeasurements" />
        <Button label="Export all" />
        <Button label="Import all" />
      </div>
  </Panel>

  <Panel v-if="measurementsStore.measurements.length > 0">
    <div>
      <DataTable @rowSelect="onRowSelect" v-model:selection="selectedMeasurement" stripedRows :value="measurementsStore.measurements" selectionMode="single" data-key="id">
        <Column field="timestamp" sortable header="Timestamp"></Column>
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