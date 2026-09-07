<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = withDefaults(defineProps<{
  code: string
  lang?: string
  filename?: string
}>(), {
  lang: 'json',
  filename: ''
})

const { copy, copied } = useClipboard({ legacy: true })
const html = ref('')

watch(() => [props.code, props.lang] as const, async ([code, lang]) => {
  html.value = code ? await highlightCode(code, lang) : ''
}, { immediate: true })
</script>

<template>
  <div class="w-full overflow-hidden rounded-md border border-default bg-elevated">
    <div
      v-if="filename"
      class="flex items-center justify-between border-b border-default px-3 py-1.5"
    >
      <span class="font-mono text-xs text-muted">{{ filename }}</span>
      <UButton
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="!code"
        @click="copy(code)"
      />
    </div>
    <div
      class="overflow-auto p-3 text-xs [&_pre]:bg-transparent! [&_pre]:p-0 [&_pre]:font-mono"
      v-html="html"
    />
  </div>
</template>
