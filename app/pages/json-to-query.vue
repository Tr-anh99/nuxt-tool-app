<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON → Query String · DevTools',
  description: 'Chuyển đối tượng JSON sang query string (key=value&key2=value2).'
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
    const parsed = JSON.parse(trimmed)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('JSON đầu vào phải là một object')
    }
    output.value = stringifyQueryString(parsed as Record<string, unknown>)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})
</script>

<template>
  <UDashboardPanel id="json-to-query">
    <template #header>
      <UDashboardNavbar
        title="JSON → Query String"
        icon="i-lucide-link-2"
      />
    </template>

    <template #body>
      <div class="grid gap-4 lg:grid-cols-2">
        <UFormField label="JSON">
          <UTextarea
            v-model="input"
            placeholder="{&quot;hecking_package_id&quot;: 3186, &quot;report_id&quot;: 2, &quot;pkg_weight&quot;: 0.0}"
            :rows="18"
            class="w-full font-mono text-xs"
            autoresize
          />
        </UFormField>

        <UFormField label="Query string">
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
            class="w-full min-h-96 overflow-auto rounded-md border border-default bg-elevated p-3 font-mono text-xs whitespace-pre-wrap break-all"
          >{{ output }}</pre>
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
