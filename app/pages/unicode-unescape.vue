<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'Unicode → Tiếng Việt · DevTools',
  description: 'Chuyển chuỗi escape Unicode (d\u1ea1ng backslash + uXXXX) sang văn bản tiếng Việt.'
})

const { copyText } = useCopyToClipboard()

const input = ref('')
const output = computed(() => unicodeUnescape(input.value))
</script>

<template>
  <UDashboardPanel id="unicode-unescape">
    <template #header>
      <UDashboardNavbar
        title="Unicode → Tiếng Việt"
        icon="i-lucide-languages"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label="Chuỗi Unicode escape"
          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="input"
            placeholder="Xác nhận đơn nộp tiền qua ví thành công"
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UFormField
          label="Tiếng Việt"
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

          <pre class="h-[75vh] w-full overflow-auto whitespace-pre-wrap wrap-break-word rounded-md border border-default bg-elevated p-3 font-mono text-xs lg:h-full">{{ output }}</pre>
        </UFormField>
      </div>
    </template>
  </UDashboardPanel>
</template>
