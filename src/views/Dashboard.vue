<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white shadow rounded flex items-center justify-between">
        <div>
          <h3 class="text-sm text-gray-500">Assigned To Me</h3>
          <div class="text-2xl font-bold">{{ stats.open }}</div>
        </div>
        <div class="bg-blue-50 text-blue-600 p-3 rounded">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
      <div class="p-4 bg-white shadow rounded flex items-center justify-between">
        <div>
          <h3 class="text-sm text-gray-500">Tickets for Approval</h3>
          <div class="text-2xl font-bold">3</div>
        </div>
        <div class="bg-yellow-50 text-yellow-600 p-3 rounded">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
      <div class="p-4 bg-white shadow rounded flex items-center justify-between">
        <div>
          <h3 class="text-sm text-gray-500">Open Tickets</h3>
          <div class="text-2xl font-bold">{{ stats.open }}</div>
        </div>
        <div class="bg-green-50 text-green-600 p-3 rounded">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded p-4 mb-4">
          <h3 class="font-medium mb-2">My Assigned Tickets</h3>
          <table class="w-full text-left">
            <thead>
              <tr class="text-sm text-gray-500 border-b">
                <th class="py-2">Ticket ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tickets" :key="t.id" class="hover:bg-gray-50 cursor-pointer" @click="selectTicket(t)">
                <td class="py-2">{{ t.id }}</td>
                <td>{{ t.subject || (t.unit && t.unit.model) || 'No title' }}</td>
                <td><span :class="statusClass(t.status)">{{ t.status }}</span></td>
                <td>{{ t.priority || 'Normal' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white shadow rounded p-4">
          <h3 class="font-medium mb-2">Tickets Awaiting Approval</h3>
          <table class="w-full text-left">
            <thead><tr class="text-sm text-gray-500 border-b"><th class="py-2">Ticket ID</th><th>Title</th><th>Requester</th></tr></thead>
            <tbody>
              <tr v-for="t in tickets.slice(0,3)" :key="'a'+t.id" class="hover:bg-gray-50 cursor-pointer">
                <td class="py-2">REQ-{{ t.id }}</td>
                <td>{{ t.subject || 'Request' }}</td>
                <td>{{ t.customer?.name || 'User' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="bg-white shadow rounded p-4">
          <h3 class="font-medium">Ticket Details</h3>
          <div v-if="selected" class="mt-3">
            <h4 class="font-semibold">{{ selected.subject || 'Service Order' }}</h4>
            <div class="mt-2">
              <label class="text-sm text-gray-600">Status</label>
              <select v-model="selected.status" @change="changeStatus(selected)" class="w-full border rounded p-2 mt-1">
                <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <p class="text-sm text-gray-500 mt-2">Priority: <strong>{{ selected.priority || 'Normal' }}</strong></p>
            <div class="mt-3 text-sm text-gray-700">{{ selected.issues || selected.description || 'No details available.' }}</div>
          </div>
          <div v-else class="text-sm text-gray-500 mt-3">Select a ticket to see details.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
store.init()

const stats = computed(()=>store.stats)
const tickets = computed(()=>store.tickets)
const selected = ref(null)
const statusOptions = ['Assessment','Remote Support','Onsite Support','Received From Logistic','In-house Diagnose','Forward to Service Center','For Buyback/CM','For Replacement','Received From Service Center','Final Checking','Passed','Failed','Picked Up','Closed']

function selectTicket(t){ selected.value = t }
function statusClass(s){
  if (!s) return 'text-sm text-gray-600'
  if (s==='open') return 'text-sm text-green-600'
  if (s==='pending') return 'text-sm text-yellow-600'
  if (s==='closed') return 'text-sm text-gray-500'
  return 'text-sm text-gray-600'
}

onMounted(()=>{})

async function changeStatus(ticket){
  if (!ticket || !ticket.id) return
  try{
    await store.updateTicket(ticket.id, { status: ticket.status })
  }catch(e){ console.error(e) }
}

</script>
