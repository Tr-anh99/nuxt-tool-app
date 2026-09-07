<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const title = 'DevTools'
const description = 'Bộ công cụ hỗ trợ công việc hàng ngày: decode JWT, format JSON, chuyển đổi env/json và sinh câu lệnh partition MySQL.'

useSeoMeta({
  title,
  description
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="DevTools"
        icon="i-lucide-wrench"
      />
    </template>

    <template #body>
      <UPageGrid class="sm:grid-cols-2 lg:grid-cols-3">
        <UPageCard
          v-for="tool in tools"
          :key="tool.id"
          :to="tool.to"
          :icon="tool.icon"
          :title="tool.label"
          :description="tool.description"
          spotlight
        />
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>
