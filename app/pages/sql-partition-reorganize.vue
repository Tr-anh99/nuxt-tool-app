<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Reorganize Partition · DevTools',
  description: 'Phân tích DDL hiện có để sinh câu lệnh drop và thêm partition mới.'
})

const { copyText } = useCopyToClipboard()

const ddl = ref('')
const periodInput = ref('')
const currentPeriod = ref<number | null>(null)
const output = ref('')
const error = ref('')

function parse() {
  output.value = ''
  error.value = ''
  currentPeriod.value = null

  if (!ddl.value.trim()) {
    return
  }

  const periodOverride = Number.parseInt(periodInput.value, 10)

  try {
    const plan = parsePartitionDdl(ddl.value, Number.isNaN(periodOverride) ? undefined : periodOverride)
    output.value = plan.sql
    currentPeriod.value = plan.currentPeriod
    periodInput.value = String(plan.period)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

watch(ddl, parse)
</script>

<template>
  <UDashboardPanel id="sql-partition-reorganize">
    <template #header>
      <UDashboardNavbar
        title="Reorganize Partition"
        icon="i-lucide-database-zap"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4">
          <UFormField label="Interval (tháng)">
            <template #hint>
              <span
                v-if="currentPeriod !== null"
                class="text-xs text-muted"
              >Hiện tại: {{ currentPeriod }}</span>
            </template>
            <UInput
              v-model="periodInput"
              type="number"
              min="0"
              step="1"
              class="w-full"
              @input="parse"
            />
          </UFormField>

          <UFormField
            label="DDL_Table"
            class="flex-1"
          >
            <UTextarea
              v-model="ddl"
              placeholder="CREATE TABLE `my_table` ( ... ) PARTITION BY RANGE ( ... )"
              :rows="18"
              class="w-full font-mono text-xs"
              autoresize
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
