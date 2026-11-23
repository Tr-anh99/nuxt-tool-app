<script setup lang="ts">
import type { NavigationMenuItem, CommandPaletteGroup } from '@nuxt/ui'

const open = ref(false)

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'Trang chủ',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    }
  ],
  ...toolGroups.map(
    group =>
      [
        { label: group, type: 'label' as const },
        ...tools
          .filter(tool => tool.group === group)
          .map(tool => ({
            label: tool.label,
            icon: tool.icon,
            to: tool.to,
            onSelect: () => {
              open.value = false
            }
          }))
      ] as NavigationMenuItem[]
  )
])

const searchGroups = computed<CommandPaletteGroup[]>(() => [
  {
    id: 'tools',
    label: 'Công cụ',
    items: tools.map(tool => ({
      label: tool.label,
      description: tool.description,
      icon: tool.icon,
      to: tool.to
    }))
  }
])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      :min-size="14"
      :default-size="17"
      :max-size="22"
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold text-highlighted"
        >
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10"
          >
            <UIcon
              name="i-lucide-wrench"
              class="size-5 text-primary"
            />
          </span>
          <span v-if="!collapsed">Công cụ</span>
        </NuxtLink>

        <div
          v-if="!collapsed"
          class="ms-auto flex items-center"
        >
          <UDashboardSidebarCollapse />
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          label="Tìm công cụ..."
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <template
          v-for="(group, index) in links.slice(1)"
          :key="index"
        >
          <UNavigationMenu
            :collapsed="collapsed"
            :items="group"
            orientation="vertical"
            tooltip
            popover
          />
        </template>
      </template>

      <template #footer="{ collapsed }">
        <div
          class="flex w-full items-center gap-2"
          :class="collapsed ? 'justify-center' : 'justify-between'"
        >
          <span
            v-if="!collapsed"
            class="text-xs text-muted"
          >
            {{ tools.length }} công cụ
          </span>
          <UColorModeButton v-if="!collapsed" />
          <UColorModeSwitch v-else />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />

    <slot />
  </UDashboardGroup>
</template>
