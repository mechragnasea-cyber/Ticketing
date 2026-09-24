<template>
  <div class="min-h-screen bg-gray-50 flex">
    <SideMenu v-if="showSideMenu" />
    <div class="flex-1 flex flex-col">
      <header class="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div class="flex items-center gap-4">
          <button class="md:hidden p-2 bg-gray-100 rounded">☰</button>
          <h1 class="text-lg font-semibold">Ticketing System</h1>
        </div>
        <div class="flex items-center gap-4">
          <input placeholder="Search tickets..." class="hidden md:block border rounded px-3 py-2" />
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Hi, {{ store.user?.username || 'there' }}</span>
            <div class="w-8 h-8 bg-brand-light rounded-full" />
          </div>
        </div>
      </header>

      <div v-if="store.error" class="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ store.error }}
      </div>
      <main class="p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SideMenu from './components/SideMenu.vue'
import { useMainStore } from './store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const store = useMainStore()
const isAuthenticated = computed(()=> store.isAuthenticated)
const showSideMenu = computed(()=> isAuthenticated.value)
</script>
