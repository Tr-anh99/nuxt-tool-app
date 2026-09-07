<script setup lang="ts">
import { useDayjs } from '#dayjs'
import { useCopyToClipboard } from '~/composables/useCopyToClipboard'
import { generatePartitionPlan, type PartitionInterval } from '~/utils/sqlPartition'

definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Tạo Partition · DevTools',
  description: 'Sinh câu lệnh PARTITION BY RANGE theo khoảng thời gian và chu kỳ.'
})

const { copyText } = useCopyToClipboard()
const dayjs = useDayjs()

const fieldName = ref('created_at')
const startDate = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const endDate = ref(dayjs().startOf('month').add(5, 'year').format('YYYY-MM-DD'))
const interval = ref<PartitionInterval>('1_THANG')
const output = ref('')
const error = ref('')

watch([fieldName, startDate, endDate, interval], () => {
  output.value = ''
  error.value = ''

  try {
    output.value = generatePartitionPlan(fieldName.value, startDate.value, endDate.value, interval.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}, { immediate: true })
</script>

<template>
  <UDashboardPanel id="sql-partition">
    <template #header>
      <UDashboardNavbar
        title="Tạo Partition"
        icon="i-lucide-table-properties"
      />
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UFormField label="Tên trường">
            <UInput
              v-model="fieldName"
              placeholder="created_at"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Thời điểm bắt đầu">
            <UInput
              v-model="startDate"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Thời điểm kết thúc">
            <UInput
              v-model="endDate"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Chu kỳ">
            <USelect
              v-model="interval"
              :items="PARTITION_INTERVAL_OPTIONS"
              class="w-full"
            />
          </UFormField>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          :title="error"
        />

        <UFormField
          v-else
          label="Kết quả"
        >
          <template #hint>
            <UButton
              icon="i-lucide-copy"
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="!output"
              @click="copyText(output)"
            />
          </template>
          <pre class="w-full min-h-96 overflow-auto rounded-md border border-default bg-elevated p-3 font-mono text-xs">{{ output }}</pre>
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
