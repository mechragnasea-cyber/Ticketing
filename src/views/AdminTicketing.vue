<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Ticketing (Public)</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Left: Create Ticket (public) -->
      <div class="bg-white shadow rounded p-4">
        <h2 class="font-medium mb-3">Create Ticket</h2>
        <CreateTicketForm @submitted="onSubmitted" />
      </div>

      <!-- Right: Check ticket status by number -->
      <div class="bg-white shadow rounded p-4">
        <h2 class="font-medium mb-3">Check Ticket Status</h2>
        <div class="mb-3">
          <label class="block text-sm">Ticket Number</label>
          <input v-model="lookup" placeholder="Enter ticket ID (e.g. 162738...)" class="w-full border p-2 rounded" />
        </div>
        <div class="flex gap-2">
          <button @click="checkStatus" class="bg-brand text-white px-4 py-2 rounded">Check</button>
          <button @click="clearLookup" class="bg-gray-200 px-4 py-2 rounded">Clear</button>
        </div>

        <div v-if="notFound" class="text-red-600 mt-3">Ticket not found.</div>
        <div v-if="found" class="mt-3">
          <h3 class="font-semibold">Ticket {{ found.id }}</h3>
          <p class="text-sm text-gray-600">Status: <strong>{{ found.status }}</strong></p>
          <p class="text-sm text-gray-600">Subject: {{ found.subject || (found.unit && found.unit.model) || '—' }}</p>
          <p class="text-sm text-gray-700 mt-2">{{ found.issues || found.description || 'No details available.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'
import CreateTicketForm from './CreateTicket.vue'

const store = useMainStore()
store.init()

const lookup = ref('')
const found = ref(null)
const notFound = ref(false)

async function checkStatus(){
  notFound.value = false
  found.value = null
  if (!lookup.value) return
  // try numeric and string match
  const idNum = Number(lookup.value)
  const tickets = store.tickets || []
  let t = tickets.find(x => String(x.id) === String(lookup.value))
  if (!t && !Number.isNaN(idNum)) t = tickets.find(x => x.id === idNum)
  if (!t) { notFound.value = true; return }
  found.value = t
}

function clearLookup(){ lookup.value=''; found.value=null; notFound.value=false }

function onSubmitted(ticket){
  // after public create, show ticket id to user
  found.value = ticket
  lookup.value = String(ticket.id)
}
</script>
