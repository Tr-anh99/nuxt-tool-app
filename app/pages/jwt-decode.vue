<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useSeoMeta({
  title: 'JWT Decode',
  description: 'Giải mã header và payload của một JSON Web Token.'
})

const token = ref('')
const headerJson = ref('')
const payloadJson = ref('')
const error = ref('')

watch(token, (value) => {
  headerJson.value = ''
  payloadJson.value = ''
  error.value = ''

  const trimmed = value.trim()
  if (!trimmed) {
    return
  }

  let segments
  try {
    segments = splitJwt(trimmed)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    return
  }

  try {
    headerJson.value = JSON.stringify(
      decodeJwtSegment(segments.header),
      null,
      2
    )
  } catch (e) {
    headerJson.value = `Lỗi header: ${e instanceof Error ? e.message : String(e)}`
  }

  try {
    payloadJson.value = JSON.stringify(
      decodeJwtSegment(segments.payload),
      null,
      2
    )
  } catch (e) {
    payloadJson.value = `Lỗi payload: ${e instanceof Error ? e.message : String(e)}`
  }
})
</script>

<template>
  <UDashboardPanel id="jwt-decode">
    <template #header>
      <UDashboardNavbar
        title="JWT Decode"
        icon="i-lucide-key-round"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid h-full gap-4 lg:grid-cols-2">
        <UFormField
          label="JWT token"

          class="flex min-h-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="token"
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            class="h-[75vh] w-full font-mono text-xs lg:h-full"
            :ui="{ base: 'h-full min-h-48 resize-none overflow-auto' }"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          :title="error"
          class="lg:col-span-1"
        />

        <div
          v-else
          class="flex flex-col gap-4"
        >
          <UFormField label="Header">
            <JsonHighlight
              :code="headerJson"
              filename="header.json"
              class="min-h-24"
            />
          </UFormField>

          <UFormField label="Payload">
            <JsonHighlight
              :code="payloadJson"
              filename="payload.json"
              class="min-h-24"
            />
          </UFormField>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
