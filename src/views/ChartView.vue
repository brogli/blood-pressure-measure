<script setup lang="ts">
import ChartComponent from "@/components/ChartComponent.vue";
import DailyAverageChartComponent from "@/components/DailyAverageChartComponent.vue";
</script>

<template>
  <div class="chart-view">
    <ChartComponent />
    <DailyAverageChartComponent />
  </div>
</template>

<style scoped>
.chart-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
