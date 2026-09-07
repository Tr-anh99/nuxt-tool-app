<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'GHTK: Tách mã đơn hàng · DevTools',
  description: 'Tách danh sách mã vận đơn Giao Hàng Tiết Kiệm thành mã đơn hàng (chuỗi số sau dấu chấm cuối cùng).'
})

const modeItems = [
  { label: 'Danh sách mã (mỗi dòng 1 mã)', value: 'list' },
  { label: 'JSON array object', value: 'json' }
]

const mode = ref<'list' | 'json'>('list')
const attribute = ref('')
const outputAttribute = ref('')
const input = ref('')
const output = ref('')
const error = ref('')

function parse() {
  output.value = ''
  error.value = ''

  if (!input.value.trim()) {
    return
  }

  try {
    const ids = mode.value === 'list'
      ? extractGhtkOrderIdsFromList(input.value)
      : extractGhtkOrderIdsFromJson(input.value, attribute.value)

    const outKey = outputAttribute.value.trim()
    const result: unknown[] = outKey
      ? ids.map(id => ({ [outKey]: id }))
      : ids

    output.value = JSON.stringify(result, null, 2)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

watch([input, attribute, outputAttribute, mode], parse)
</script>

<template>
  <UDashboardPanel id="ghtk-order-code">
    <template #header>
      <UDashboardNavbar
        title="GHTK: Tách mã đơn hàng"
        icon="i-lucide-truck"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4">
          <UFormField label="Kiểu dữ liệu đầu vào">
            <URadioGroup
              v-model="mode"
              orientation="horizontal"
              :items="modeItems"
            />
          </UFormField>

          <UFormField
            v-if="mode === 'json'"
            label="Tên attribute chứa mã vận đơn"
          >
            <UInput
              v-model="attribute"
              placeholder="orderCode"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Tên attribute đầu ra">
            <template #hint>
              <span class="text-xs text-muted">Để trống để xuất mảng string</span>
            </template>
            <UInput
              v-model="outputAttribute"
              placeholder="orderId"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="mode === 'list' ? 'Danh sách mã vận đơn GHTK' : 'JSON đầu vào (mảng object)'"
            class="flex-1"
          >
            <template
              v-if="mode === 'list'"
              #hint
            >
              <span class="text-xs text-muted">Mỗi mã một dòng</span>
            </template>
            <UTextarea
              v-model="input"
              :placeholder="mode === 'list'
                ? 'S23100914.HNP92-K5.1356733601\nS23100914.HNP92-F95.1447309983'
                : '[{&quot;orderCode&quot;: &quot;S23100914.HNP92-K5.1356733601&quot;}]'"
              :rows="18"
              class="w-full font-mono text-xs"
              autoresize
            />
          </UFormField>
        </div>

        <UFormField label="Mã đơn hàng">
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
