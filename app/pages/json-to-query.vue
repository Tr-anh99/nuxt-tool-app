<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JSON → Query String',
  description:
    'Chuyển đối tượng JSON sang query string (key=value&key2=value2).'
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
    if (
      typeof parsed !== 'object'
      || parsed === null
      || Array.isArray(parsed)
    ) {
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
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label="JSON"
          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="input"
            placeholder="{&quot;hecking_package_id&quot;: 3186, &quot;report_id&quot;: 2, &quot;pkg_weight&quot;: 0.0}"
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UFormField
          label="Query string"
          class="flex min-h-0 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
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
            class="h-[75vh] w-full overflow-auto lg:h-full rounded-md border border-default bg-elevated p-3 font-mono text-xs whitespace-pre-wrap break-all"
          >{{ output }}</pre>
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
