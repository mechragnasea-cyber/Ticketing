<template>
  <aside class="w-72 bg-white border-r hidden lg:flex flex-col">
    <div class="p-5 border-b flex items-center gap-3">
      <div class="w-10 h-10 bg-brand rounded flex items-center justify-center text-white font-bold">J</div>
      <div>
        <div class="text-sm font-semibold">JONECOTECH</div>
        <div class="text-xs text-gray-500">Support Portal</div>
      </div>
    </div>

    <nav class="p-4 flex-1">
      <ul class="space-y-2">
        <li>
          <router-link to="/create-ticket" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-sm">Create Ticket</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"/></svg>
            <span class="text-sm">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/tickets" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-3l-2-2H8L6 5H3a2 2 0 00-2 2v3a2 2 0 002 2h2"/></svg>
            <span class="text-sm">My Tickets</span>
          </router-link>
        </li>
        <li>
          <router-link to="/approvals" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-sm">Approvals</span>
          </router-link>
        </li>
        <li>
          <router-link to="/maintenance" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-sm">Maintenance</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-sm">Reports</span>
          </router-link>
        </li>
        <li v-if="isSupport">
          <router-link to="/ticketing" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="text-sm">Ticketing</span>
          </router-link>
        </li>
        <li v-if="isAdmin">
          <router-link to="/users" class="flex items-center gap-3 p-3 rounded hover:bg-gray-50">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3zm10 2c-2.667 1.333-8 4-10 4v2h16v-2c-2-0.667-5.333-2.667-6-4z" stroke-width="0"/></svg>
            <span class="text-sm">Admin Panel</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t">
      <a class="text-xs text-gray-500">v0.1</a>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
const isAdmin = computed(()=> store.user?.role === 'Admin')
const isSupport = computed(()=> ['Admin','Manager'].includes(store.user?.role))
</script>

<style scoped>
</style>
