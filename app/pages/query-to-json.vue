<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Query String → JSON',
  description:
    'Chuyển query string (key=value&key2=value2) sang đối tượng JSON.'
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
    output.value = JSON.stringify(parseQueryString(trimmed), null, 2)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})
</script>

<template>
  <UDashboardPanel id="query-to-json">
    <template #header>
      <UDashboardNavbar
        title="Query String → JSON"
        icon="i-lucide-link-2"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label="Query string"
          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="input"
            placeholder="hecking_package_id=3186&report_id=2&pkg_weight=0.0"
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UFormField
          label="JSON"
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
