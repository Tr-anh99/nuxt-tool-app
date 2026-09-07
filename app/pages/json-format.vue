<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON Format · DevTools',
  description: 'Format lại chuỗi JSON cho dễ đọc và kiểm tra cú pháp.'
})

const input = ref('')
const output = ref('')
const error = ref('')

watch(input, (value) => {
  output.value = ''
  error.value = ''

  const trimmed = value.trim()
  if (!trimmed) {
    return
  }

  try {
    output.value = JSON.stringify(JSON.parse(trimmed), null, 2)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})
</script>

<template>
  <UDashboardPanel id="json-format">
    <template #header>
      <UDashboardNavbar
        title="JSON Format"
        icon="i-lucide-braces"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <UFormField label="JSON string">
          <UTextarea
            v-model="input"
            placeholder="{&quot;key&quot;: &quot;value&quot;}"
            :rows="18"
            class="w-full font-mono text-xs"
            autoresize
          />
        </UFormField>

        <UFormField label="Formatted">
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
