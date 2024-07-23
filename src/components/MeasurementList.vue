<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const products = [
  { code: 'code0', name: 'name0', category: 'category0', quantity: 'quantity0' },
  { code: 'code1', name: 'name1', category: 'category1', quantity: 'quantity1' }
]
</script>

<template>
  <DataTable stripedRows :value="products" tableStyle="min-width: 50rem">
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
  </DataTable>
</template>

<style scoped>

</style>