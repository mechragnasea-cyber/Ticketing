<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Ticket Management</h1>
    <div class="bg-white shadow rounded">
      <table class="w-full">
        <thead class="text-sm text-gray-500 border-b"><tr><th class="p-3 text-left">ID</th><th class="p-3 text-left">Subject</th><th class="p-3 text-left">Status</th><th class="p-3 text-left">Priority</th></tr></thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id" class="hover:bg-gray-50">
            <td class="p-3">{{ t.id }}</td>
            <td class="p-3">{{ t.subject || '—' }}</td>
            <td class="p-3">
              <select v-model="t.status" @change="updateStatus(t)" class="border rounded p-1 text-sm">
                <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td class="p-3">{{ t.priority || 'Normal' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../store'
import { ref } from 'vue'
const store = useMainStore()
store.init()
const tickets = store.tickets
const statusOptions = ['Assessment','Remote Support','Onsite Support','Received From Logistic','In-house Diagnose','Forward to Service Center','For Buyback/CM','For Replacement','Received From Service Center','Final Checking','Passed','Failed','Picked Up','Closed']

async function updateStatus(t){
  if (!t || !t.id) return
  try{ await store.updateTicket(t.id, { status: t.status }) }catch(e){ console.error(e) }
}
</script>
