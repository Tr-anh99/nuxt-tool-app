<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON Format',
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
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label="JSON string"
          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="input"
            placeholder="{&quot;key&quot;: &quot;value&quot;}"
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UFormField
          label="Formatted"
          class="flex min-h-0 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
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
            class="h-[75vh] lg:h-full"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
