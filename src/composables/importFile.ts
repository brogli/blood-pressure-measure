import { useFileDialog } from '@vueuse/core'
import { useMeasurementsStore } from '@/stores/measurements'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toastStore'

export function useImportfile(t: (key: string) => string) {
  const measurementsStore = useMeasurementsStore()
  const { currentToast } = storeToRefs(useToastStore())

  const { open, onChange } = useFileDialog({
    accept: 'text/csv',
  })

  onChange(async (files) => {
    const file = files?.item(0)
    if (file) {
      importCsv(await file.text())
    } else {
      showImportError()
    }
  })

  function importCsv(text: string): void {
    const rejectedRows = measurementsStore.importCsv(text)
    if (rejectedRows > 0) {
      showImportError()
    }
  }

  function showImportError(): void {
    currentToast.value = {
      severity: 'error',
      summary: t('common.error'),
      detail: t('toasts.errorWhileImportingCsv'),
      life: 3000,
    }
  }

  return { open }
}
