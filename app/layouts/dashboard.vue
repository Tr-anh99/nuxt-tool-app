<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = tools.map(tool => ({
  label: tool.label,
  icon: tool.icon,
  to: tool.to
}))
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      collapsible
      resizable
      :min-size="14"
      :default-size="17"
      :max-size="22"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold text-highlighted"
        >
          <UIcon
            name="i-lucide-wrench"
            class="size-5 shrink-0 text-primary"
          />
          <span v-if="!collapsed">DevTools</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UColorModeButton v-if="!collapsed" />
        <UColorModeSwitch v-else />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
