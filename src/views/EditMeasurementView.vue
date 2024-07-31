<script setup lang="ts">
import MeasurementForm from "@/components/MeasurementForm.vue";

defineProps<{
  id: string;
}>();
</script>

<template>
  <MeasurementForm :id="id" />
</template>

<style scoped></style>
