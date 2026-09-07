<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON → Env · DevTools',
  description: 'Chuyển đối tượng JSON sang các dòng biến môi trường.'
})

const { copyText } = useCopyToClipboard()

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
    output.value = jsonToEnv(trimmed)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})
</script>

<template>
  <UDashboardPanel id="json-to-env">
    <template #header>
      <UDashboardNavbar
        title="JSON → Env"
        icon="i-lucide-file-cog"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <UFormField label="JSON string">
          <UTextarea
            v-model="input"
            placeholder="{&quot;DATABASE_URL&quot;: &quot;postgres://localhost:5432/app&quot;, &quot;DEBUG&quot;: true}"
            :rows="18"
            class="w-full font-mono text-xs"
            autoresize
          />
        </UFormField>

        <UFormField label=".env">
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

          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            icon="i-lucide-triangle-alert"
            :title="error"
          />
          <pre
            v-else
            class="w-full min-h-96 overflow-auto rounded-md border border-default bg-elevated p-3 font-mono text-xs"
          >{{ output }}</pre>
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
