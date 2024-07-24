<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useMeasurementsStore } from "@/stores/measurements";
import Card from "primevue/card";

const measurementsStore = useMeasurementsStore();

function deleteAllMeasurements() {
  // TODO: trigger modal to ask user
  measurementsStore.clearMeasurements();
}
</script>

<template>


  <Card>
    <template #title>Measurements</template>
    <template #content>
      <div class="measurement-buttons-parent">
        <Button label="New" as="router-link" to="/new" />
        <Button label="Delete all" severity="danger" @click="deleteAllMeasurements" />
        <Button label="Export all" />
        <Button label="Import all" />
      </div>
    </template>
  </Card>

  <Card>
    <template #content>
      <DataTable stripedRows :value="measurementsStore.measurements" tableStyle="min-width: 50rem">
        <Column field="timestamp" sortable header="Timestamp"></Column>
        <Column field="systolic" sortable header="Systolic"></Column>
        <Column field="diastolic" sortable header="Diastolic"></Column>
        <Column field="heartRate" sortable header="Heart Rate"></Column>
        <Column field="whichArm" sortable header="Which Arm?"></Column>
      </DataTable>
    </template>
  </Card>


</template>

<style scoped>

.measurement-buttons-parent {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1rem;
}
</style>