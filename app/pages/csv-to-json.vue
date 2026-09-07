<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'CSV → JSON · DevTools',
  description: 'Chuyển file CSV sang mảng JSON, tự động ép kiểu number khi có thể.'
})

const file = ref<File | null>(null)
const output = ref('')
const error = ref('')

watch(file, async (value) => {
  output.value = ''
  error.value = ''

  if (!value) {
    return
  }

  try {
    const text = await value.text()
    output.value = JSON.stringify(csvToJson(text), null, 2)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})
</script>

<template>
  <UDashboardPanel id="csv-to-json">
    <template #header>
      <UDashboardNavbar
        title="CSV → JSON"
        icon="i-lucide-file-spreadsheet"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <UFormField label="File CSV">
          <UFileUpload
            v-model="file"
            accept=".csv,text/csv"
            icon="i-lucide-file-spreadsheet"
            label="Kéo thả hoặc chọn file CSV"
            description="Dòng đầu tiên được coi là tiêu đề (header). Giá trị có thể ép kiểu number sẽ tự động chuyển sang number."
            class="w-full min-h-96"
          />
        </UFormField>

        <UFormField label="JSON">
          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            icon="i-lucide-triangle-alert"
            :title="error"
          />
          <JsonHighlight
            v-else
            :code="output"
            filename="output.json"
            class="min-h-96"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
