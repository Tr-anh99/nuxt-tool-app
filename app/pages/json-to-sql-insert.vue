<script setup lang="ts">
import type { SqlFieldMapping } from '~/utils/sqlInsertMany'

definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON → SQL Insert · DevTools',
  description: 'Sinh câu lệnh INSERT INTO nhiều dòng từ mảng JSON, tuỳ chỉnh field bằng attribute hoặc template chuỗi.'
})

const { copyText } = useCopyToClipboard()

const table = ref('table_name')
const input = ref('')
const mappings = ref<SqlFieldMapping[]>([])
const batchSize = ref(0)
const output = ref('')
const error = ref('')

const mappingsConfig = ref('[]')
const mappingsConfigError = ref('')

watch(mappings, () => {
  mappingsConfig.value = JSON.stringify(mappings.value, null, 2)
}, { deep: true, immediate: true })

function applyMappingsConfig() {
  mappingsConfigError.value = ''

  try {
    const parsed = JSON.parse(mappingsConfig.value)
    if (!Array.isArray(parsed)) {
      throw new Error('Cấu hình phải là một mảng.')
    }
    mappings.value = parsed
  } catch (e) {
    mappingsConfigError.value = e instanceof Error ? e.message : String(e)
  }
}

function addMapping() {
  mappings.value.push({ key: '', mode: 'attribute', value: '' })
}

function removeMapping(index: number) {
  mappings.value.splice(index, 1)
}

function clearMappings() {
  mappings.value = []
}

function valuePlaceholder(mapping: SqlFieldMapping) {
  if (mapping.mode === 'attribute') {
    return 'Tên attribute trong JSON, vd: name'
  }
  if (mapping.mode === 'template') {
    return '{{firstName}} {{lastName}}'
  }
  return mapping.staticType === 'raw' ? 'NOW(), UUID(), ...' : 'Giá trị cố định'
}

function parse() {
  output.value = ''
  error.value = ''

  if (!input.value.trim()) {
    return
  }

  try {
    output.value = buildSqlInsertMany(input.value, table.value, mappings.value, { batchSize: batchSize.value })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

watch([input, table, mappings, batchSize], parse, { deep: true })
</script>

<template>
  <UDashboardPanel id="json-to-sql-insert">
    <template #header>
      <UDashboardNavbar
        title="JSON → SQL Insert"
        icon="i-lucide-table-2"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4">
          <UFormField label="Tên bảng">
            <UInput
              v-model="table"
              placeholder="package_values"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Kích thước batch (số record/lệnh)">
            <template #hint>
              <span class="text-xs text-muted">Để trống hoặc 0 = không chia batch (tất cả records trong 1 lệnh)</span>
            </template>
            <UInput
              v-model.number="batchSize"
              type="number"
              placeholder="0"
              min="0"
              class="w-full"
            />
          </UFormField>

          <UFormField label="JSON đầu vào (mảng object)">
            <UTextarea
              v-model="input"
              placeholder="[{&quot;pkg_order&quot;: 1822506402, &quot;field_id&quot;: 48, &quot;value&quot;: &quot;2026-08-08 00:00:00&quot;}]"
              :rows="12"
              class="w-full font-mono text-xs"
            />
          </UFormField>

          <UFormField label="Field tuỳ chỉnh">
            <template #hint>
              <span class="text-xs text-muted">Để trống danh sách sẽ dùng toàn bộ attribute của object đầu tiên</span>
            </template>

            <div class="flex flex-col gap-2">
              <div
                v-for="(mapping, index) in mappings"
                :key="index"
                class="flex flex-wrap items-center gap-2 rounded-md border border-default p-2"
              >
                <UInput
                  v-model="mapping.key"
                  placeholder="Tên cột"
                  class="w-32"
                />
                <USelect
                  v-model="mapping.mode"
                  :items="SQL_FIELD_MODE_OPTIONS"
                  class="w-40"
                />
                <USelect
                  v-if="mapping.mode === 'static'"
                  v-model="mapping.staticType"
                  :items="SQL_STATIC_TYPE_OPTIONS"
                  class="w-36"
                />
                <UInput
                  v-if="mapping.mode !== 'now'"
                  v-model="mapping.value"
                  :placeholder="valuePlaceholder(mapping)"
                  class="min-w-40 flex-1"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="removeMapping(index)"
                />
              </div>

              <div class="flex gap-2">
                <UButton
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  label="Thêm field"
                  @click="addMapping"
                />
                <UButton
                  v-if="mappings.length > 0"
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  label="Xoá tất cả"
                  @click="clearMappings"
                />
              </div>
            </div>
          </UFormField>

          <UFormField label="Cấu hình field (JSON)">
            <template #hint>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted">Copy để lưu lại, dán vào để áp dụng cho lần sau</span>
                <UButton
                  icon="i-lucide-copy"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :disabled="!mappingsConfig"
                  @click="copyText(mappingsConfig)"
                />
              </div>
            </template>

            <div class="flex flex-col gap-2">
              <UTextarea
                v-model="mappingsConfig"
                :rows="6"
                class="w-full font-mono text-xs"
                autoresize
              />
              <UAlert
                v-if="mappingsConfigError"
                color="error"
                variant="subtle"
                icon="i-lucide-triangle-alert"
                :title="mappingsConfigError"
              />
              <UButton
                icon="i-lucide-check"
                color="primary"
                variant="subtle"
                size="xs"
                label="Áp dụng cấu hình"
                class="self-start"
                @click="applyMappingsConfig"
              />
            </div>
          </UFormField>
        </div>

        <UFormField label="Kết quả">
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
            lang="sql"
            filename="insert.sql"
            class="min-h-96"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
