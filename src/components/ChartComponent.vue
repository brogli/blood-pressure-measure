<script setup lang="ts">
import Chart from "primevue/chart";
import { onMounted, ref } from "vue";
import { useMeasurementsStore } from "@/stores/measurements";
import type { Measurement } from "@/models/Measurement";
import { MeasurementDto } from "@/models/MeasurementDto";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import InputNumber, { type InputNumberInputEvent } from "primevue/inputnumber";
import Panel from "primevue/panel";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const amountOfDataPoints = ref(5);

const measurementStore = useMeasurementsStore();

let preparedData: MeasurementDto[];

function initializePreparedData() {
  const sortedByTime = sortByTime(measurementStore.getAllMeasurements);
  const measurementDto = mapToDto(sortedByTime);
  return takeLast(amountOfDataPoints.value, measurementDto);
}

function sortByTime(measurements: Measurement[]): Measurement[] {
  return measurements.sort(
    (a: Measurement, b: Measurement) => a.timestamp.nativeTimeStamp.getTime() - b.timestamp.nativeTimeStamp.getTime(),
  );
}

function mapToDto(measurements: Measurement[]): MeasurementDto[] {
  return measurements.map((m) => new MeasurementDto(m));
}

function takeLast(howMany: number, measurements: MeasurementDto[]): MeasurementDto[] {
  return measurements.slice(-howMany, measurements.length);
}

function updateChart(event: InputNumberInputEvent) {
  const potentialNumber = event.value;
  let newNumber = 5;

  if (potentialNumber) {
    if (typeof potentialNumber === "string") {
      newNumber = Number.parseInt(potentialNumber);
    } else {
      newNumber = potentialNumber;
    }
  }

  amountOfDataPoints.value = newNumber;
  preparedData = initializePreparedData();
  chartOptions.value = setChartOptions();
  chartData.value = setChartData();
}

onMounted(() => {
  preparedData = initializePreparedData();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: preparedData.map((m) => m.timestampIso8601),
    datasets: [
      {
        label: "Systolic",
        data: preparedData.map((m) => {
          return {
            x: m.timestampIso8601,
            y: m.systolic,
          };
        }),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
        tension: 0.4,
      },
      {
        label: "Diastolic",
        data: preparedData.map((m) => {
          return {
            x: m.timestampIso8601,
            y: m.diastolic,
          };
        }),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--p-gray-500"),
        tension: 0.4,
      },
      {
        label: "Heart Rate",
        data: preparedData.map((m) => {
          return {
            x: m.timestampIso8601,
            y: m.heartRate,
          };
        }),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--p-purple-500"),
        tension: 0.4,
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--p-text-muted-color");
  const surfaceBorder = documentStyle.getPropertyValue("--p-content-border-color");

  return {
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "YYYY-MM-DD HH:mm:ss",
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>

<template>
  <section>
    <Panel :header="t('chart.chartsTitle')">
      <label for="withoutgrouping" class="2"> Amount of data points </label>
      <InputNumber
        @input="updateChart($event)"
        v-model="amountOfDataPoints"
        inputId="withoutgrouping"
        :useGrouping="false"
      />
    </Panel>
    <Panel>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </Panel>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
