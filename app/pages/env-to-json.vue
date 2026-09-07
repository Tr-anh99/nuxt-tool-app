<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Env → JSON · DevTools',
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
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <UFormField label=".env content">
          <UTextarea
            v-model="input"
            placeholder="DATABASE_URL=postgres://localhost:5432/app&#10;DEBUG=true"
            :rows="18"
            class="w-full font-mono text-xs"
            autoresize
          />
        </UFormField>

        <UFormField label="JSON">
          <JsonHighlight
            :code="output"
            filename="output.json"
            class="min-h-96"
          />
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
