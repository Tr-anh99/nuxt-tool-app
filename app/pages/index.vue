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

const sections = toolGroups.map(group => ({
  group,
  items: tools.filter(tool => tool.group === group)
}))
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Tổng quan">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UDashboardSearchButton
            label="Tìm công cụ..."
            class="hidden sm:flex"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UPageCard
          icon="i-lucide-wrench"
          title="Tổng số công cụ"
          variant="subtle"
          :ui="{ title: 'text-3xl font-semibold text-highlighted' }"
        >
          <template #title>
            {{ tools.length }}
          </template>
          <template #description>
            Tổng số công cụ
          </template>
        </UPageCard>
        <UPageCard
          v-for="section in sections"
          :key="section.group"
          variant="subtle"
        >
          <template #title>
            <span class="text-3xl font-semibold text-highlighted">{{ section.items.length }}</span>
          </template>
          <template #description>
            {{ section.group }}
          </template>
        </UPageCard>
      </div>

      <section
        v-for="section in sections"
        :key="section.group"
        class="space-y-3"
      >
        <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">
          {{ section.group }}
        </h2>
        <UPageGrid class="sm:grid-cols-2 lg:grid-cols-3">
          <UPageCard
            v-for="tool in section.items"
            :key="tool.id"
            :to="tool.to"
            :icon="tool.icon"
            :title="tool.label"
            :description="tool.description"
            spotlight
          />
        </UPageGrid>
      </section>
    </template>
  </UDashboardPanel>
</template>
