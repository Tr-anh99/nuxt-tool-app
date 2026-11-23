<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Env → JSON',
  description: 'Chuyển nội dung file .env sang đối tượng JSON.'
})

const input = ref('')

const output = computed(() => {
  if (!input.value.trim()) {
    return ''
  }

  return JSON.stringify(parseDotenv(input.value), null, 2)
})
</script>

<template>
  <UDashboardPanel id="env-to-json">
    <template #header>
      <UDashboardNavbar
        title="Env → JSON"
        icon="i-lucide-file-json-2"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label=".env content"
          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="input"
            placeholder="DATABASE_URL=postgres://localhost:5432/app&#10;DEBUG=true"
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UFormField
          label="JSON"
          class="flex min-h-0 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <JsonHighlight
            :code="output"
            filename="output.json"
            class="h-[75vh] lg:h-full"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
