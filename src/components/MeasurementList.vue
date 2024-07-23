<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const products = [
  { code: 'code0', name: 'name0', category: 'category0', quantity: 'quantity0' },
  { code: 'code1', name: 'name1', category: 'category1', quantity: 'quantity1' }
]
</script>

<template>


  <div class="measurements-menu">
    <h2 class="measurements-title">Measurements</h2>
    <div class="measurement-buttons-parent">
      <Button label="New" />
      <Button label="Delete all"  severity="danger"/>
      <Button label="Export all" />
      <Button label="Import all" />
    </div>
  </div>
  <DataTable stripedRows :value="products" tableStyle="min-width: 50rem">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
  </DataTable>


</template>

<style scoped>
.measurements-menu {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

}

.measurement-buttons-parent {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1rem;
}
</style>