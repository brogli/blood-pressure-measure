<script setup lang="ts">
import { computed, ref } from 'vue'
import InputNumber from 'openvue/inputnumber'
import SelectButton from 'openvue/selectbutton'
import { type ArmOption, Measurement } from '@/models/Measurement'
import Button from 'openvue/button'
import { useMeasurementsStore } from '@/stores/measurements'
import { useRouter } from 'vue-router'
import Panel from 'openvue/panel'
import DatePicker from 'openvue/datepicker'
import Divider from 'openvue/divider'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toastStore'
import ConfirmDialog from 'openvue/confirmdialog'
import { useConfirm } from 'openvue/useconfirm'
import vFocustrap from 'openvue/focustrap'

const measurementStore = useMeasurementsStore()
const router = useRouter()
const { t } = useI18n()
const { currentToast } = storeToRefs(useToastStore())
const confirm = useConfirm()

const currentMeasurement = ref<Measurement>(
  new Measurement(new Date(), undefined, undefined, undefined, 'Left'),
)

const armSelectionOptions = ref<ArmOption[]>(['Left', 'Right'])

const props = defineProps<{
  id?: string
}>()

// validated on click, not via a disabled Save: InputNumber only updates its model on blur
const isMissingValueShown = ref(false)

function handleSaveClick() {
  const { systolic, diastolic } = currentMeasurement.value
  // a cleared InputNumber holds null
  if (systolic == null || diastolic == null) {
    isMissingValueShown.value = true
  } else {
    saveMeasurement()
  }
}

function confirmDelete() {
  confirm.require({
    message: t('measurementForm.confirmDeleteText'),
    header: 'Danger Zone',
    icon: 'oi oi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: t('measurementForm.cancelButton'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('measurementForm.deleteButton'),
      severity: 'danger',
    },
    accept: () => {
      continueDelete()
    },
    reject: () => {},
  })
}

function handleDeleteClick() {
  confirmDelete()
}

function continueDelete() {
  const isSuccessful = measurementStore.deleteMeasurement(props.id)
  if (isSuccessful) {
    currentToast.value = {
      severity: 'success',
      summary: t('common.success'),
      detail: t('toasts.successfullyDeletedMeasurement'),
      life: 3000,
    }
    router.push({ name: 'home' })
  } else {
    currentToast.value = {
      severity: 'error',
      summary: t('common.error'),
      detail: t('toasts.errorWhileDeletingMeasurement'),
      life: 3000,
    }
  }
}

function saveMeasurement() {
  measurementStore.saveMeasurement(currentMeasurement.value)
  router.push({ name: 'home' })
}

function loadMeasurement(id: string) {
  const clone: Measurement | undefined = measurementStore.getMeasurement(id)?.getClone()
  if (clone) {
    currentMeasurement.value = clone
  } else {
    currentToast.value = {
      severity: 'error',
      summary: t('common.error'),
      detail: t('toasts.errorWhileLoadingMeasurement'),
      life: 3000,
    }
    router.replace({ name: 'home' })
  }
}

function getLeftRightLabel(arm: ArmOption): string {
  if (arm === 'Left') {
    return t('measurement.left')
  } else {
    return t('measurement.right')
  }
}

const isInEditmode = props.id != undefined
const header = computed(() =>
  isInEditmode ? t('measurementForm.editMeasurement') : t('measurementForm.addMeasurement'),
)

if (isInEditmode) {
  loadMeasurement(props.id)
}
</script>

<template>
  <Panel :header="header">
    <ConfirmDialog></ConfirmDialog>
    <div class="flex flex-col gap-y-4">
      <div class="flex flex-wrap gap-4">
        <div class="grow shrink-3 basis-48">
          <label for="timestamp">{{ t('measurement.createdAt') }}</label>
          <DatePicker
            showIcon
            id="datepicker-24h"
            v-model="currentMeasurement.timestamp"
            showTime
            hourFormat="24"
            fluid
            updateModelType="date"
          />
        </div>
        <div class="grow shrink-3 basis-48">
          <label for="systolic">{{ t('measurement.systolic') }}</label>
          <InputNumber
            placeholder="120"
            v-model="currentMeasurement.systolic"
            :invalid="isMissingValueShown && currentMeasurement.systolic == null"
            v-focustrap
            inputId="systolic"
            fluid
          />
        </div>
        <div class="grow shrink-3 basis-48">
          <label for="diastolic">{{ t('measurement.diastolic') }}</label>
          <InputNumber
            placeholder="80"
            v-model="currentMeasurement.diastolic"
            :invalid="isMissingValueShown && currentMeasurement.diastolic == null"
            inputId="diastolic"
            fluid
          />
        </div>
        <div class="grow shrink-3 basis-48">
          <label for="heartrate">{{ t('measurement.heartRate') }}</label>
          <InputNumber
            placeholder="80"
            v-model="currentMeasurement.heartRate"
            inputId="heartrate"
            fluid
          />
        </div>
        <div>
          <label for="armSelection">{{ t('measurement.whichArm') }}</label>
          <SelectButton
            inputId="armSelection"
            v-model="currentMeasurement.whichArm"
            :options="armSelectionOptions"
            :allowEmpty="false"
            :option-label="getLeftRightLabel"
            aria-labelledby="basic"
            class="flex"
          />
        </div>
      </div>
    </div>

    <Divider />
    <div class="flex flex-row-reverse justify-between">
      <div class="flex gap-4">
        <Button :label="t('measurementForm.saveButton')" @click="handleSaveClick" />
        <Button
          :label="t('measurementForm.cancelButton')"
          severity="secondary"
          as="router-link"
          to="/"
        />
      </div>
      <div>
        <Button
          v-if="isInEditmode"
          :label="t('measurementForm.deleteButton')"
          severity="danger"
          @click="handleDeleteClick"
        />
      </div>
    </div>
  </Panel>
</template>
