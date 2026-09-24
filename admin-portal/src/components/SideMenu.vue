<template>
  <aside class="w-64 bg-slate-800 text-white flex flex-col">
    <div class="p-4 bg-gradient-to-b from-slate-900 to-blue-800">
      <div class="text-lg font-bold">JONECOTECH</div>
      <div class="text-xs opacity-80">Admin Portal</div>
    </div>
    <nav class="p-4 flex-1">
      <ul class="space-y-2 text-sm">
        <li><router-link class="block px-3 py-2 rounded hover:bg-slate-700" to="/dashboard">Dashboard</router-link></li>
        <li><router-link class="block px-3 py-2 rounded hover:bg-slate-700" to="/dashboard/reports">Reports</router-link></li>
        <li><router-link class="block px-3 py-2 rounded hover:bg-slate-700" to="/invoice-maintenance">Invoice Maintenance</router-link></li>
        <li><router-link class="flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700" to="/tickets"><span>Ticket Management</span><span v-if="unreadCount" class="text-[10px] bg-red-500 rounded-full px-2 py-0.5">{{ unreadCount }}</span></router-link></li>
        <li><router-link class="block px-3 py-2 rounded hover:bg-slate-700" to="/admin-panel">Admin Panel</router-link></li>
      </ul>
    </nav>
    <div class="p-4 border-t border-slate-700">
      <button class="w-full bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded">Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'

const notifications = ref([])
try { notifications.value = JSON.parse(localStorage.getItem('admin_notifications') || '[]') } catch { notifications.value = [] }
const unreadCount = computed(() => notifications.value.filter(item => !item.read).length)
</script>
