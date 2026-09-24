<template>
  <div>
    <div v-if="!isAdmin">
      <div class="h-full flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-2">Under Maintenance</h1>
          <p class="text-gray-600">The system is currently under maintenance. Please check back later.</p>
        </div>
      </div>
    </div>
    <div v-else class="max-w-2xl">
      <h1 class="text-2xl font-semibold mb-4">Admin — Maintenance & Workflow</h1>
      <div class="bg-white p-4 rounded shadow mb-4">
        <label class="flex items-center gap-3"><input type="checkbox" v-model="maintenance" @change="toggleMaintenance" /> <span>Enable system maintenance (redirects users)</span></label>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">Status Workflow (dropdown options)</h2>
        <ul class="text-sm text-gray-700">
          <li v-for="s in statusOptions" :key="s" class="py-1">• {{ s }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
const isAdmin = computed(()=> store.user?.role === 'Admin')
const maintenance = ref(store.maintenance)
const statusOptions = ['Assessment','Remote Support','Onsite Support','Received From Logistic','In-house Diagnose','Forward to Service Center','For Buyback/CM','For Replacement','Received From Service Center','Final Checking','Passed','Failed','Picked Up','Closed']

function toggleMaintenance(){ store.maintenance = maintenance.value }
</script>
