<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON → Array · DevTools',
  description: 'Trích giá trị của một hoặc nhiều attribute từ mảng object JSON thành mảng mới.'
})

const input = ref('')
const attribute = ref('')
const output = ref('')
const error = ref('')

function parse() {
  output.value = ''
  error.value = ''

  if (!input.value.trim()) {
    return
  }

  try {
    output.value = JSON.stringify(jsonToArray(input.value, attribute.value), null, 2)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

watch([input, attribute], parse)
</script>

<template>
  <UDashboardPanel id="json-to-array">
    <template #header>
      <UDashboardNavbar
        title="JSON → Array"
        icon="i-lucide-list"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4">
          <UFormField label="Tên attribute">
            <template #hint>
              <span class="text-xs text-muted">Nhiều attribute cách nhau bởi dấu phẩy</span>
            </template>
            <UInput
              v-model="attribute"
              placeholder="name hoặc id, name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="JSON đầu vào (mảng object)"
            class="flex-1"
          >
            <UTextarea
              v-model="input"
              placeholder="[{&quot;id&quot;: 1, &quot;name&quot;: &quot;Táo&quot;}, {&quot;id&quot;: 2, &quot;name&quot;: &quot;Cam&quot;}]"
              :rows="18"
              class="w-full font-mono text-xs"
              autoresize
            />
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
            filename="output.json"
            class="min-h-96"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
