<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Operations</p>
        <h2 class="text-3xl font-semibold text-slate-800 mt-1">Ticket Management</h2>
      </div>
      <button @click="refresh" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium">
        Refresh
      </button>
    </header>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input v-model="searchText" type="text" placeholder="Search ticket, subject, invoice..." class="border border-slate-300 rounded-lg px-3 py-2.5" />

        <select v-model="statusFilter" class="border border-slate-300 rounded-lg px-3 py-2.5">
          <option value="all">All statuses</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Waiting for Customer">Waiting for Customer</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select v-model="assigneeFilter" class="border border-slate-300 rounded-lg px-3 py-2.5">
          <option value="all">All assignees</option>
          <option value="Unassigned">Unassigned</option>
          <option v-for="person in assigneeOptions" :key="person" :value="person">{{ person }}</option>
        </select>

        <select v-model="priorityFilter" class="border border-slate-300 rounded-lg px-3 py-2.5">
          <option value="all">All priorities</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div class="flex items-center justify-between text-sm text-slate-600">
        <div>{{ filteredTickets.length }} tickets <span v-if="selectedIds.length">• {{ selectedIds.length }} selected</span></div>
        <div class="flex items-center gap-4">
          <button @click="saveCurrentFilter" class="text-blue-700 hover:underline">Save view</button>
          <button @click="clearFilters" class="text-blue-700 hover:underline">Clear filters</button>
        </div>
      </div>
    </div>

    <div v-if="selectedIds.length" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
      <span class="text-sm font-medium text-blue-900">Bulk actions</span>
      <select v-model="bulkAssignee" class="border border-blue-200 rounded-lg px-3 py-2 bg-white text-sm">
        <option value="">Assign to...</option>
        <option value="Unassigned">Unassigned</option>
        <option v-for="person in assigneeOptions" :key="person" :value="person">{{ person }}</option>
      </select>
      <select v-model="bulkStatus" class="border border-blue-200 rounded-lg px-3 py-2 bg-white text-sm">
        <option value="">Change status...</option>
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
      </select>
      <button @click="applyBulkActions" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium">Apply</button>
      <button @click="selectedIds = []" class="text-sm text-blue-700 hover:underline">Cancel</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[900px]">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="py-3 px-4 text-left font-semibold"><input v-model="allSelected" type="checkbox" aria-label="Select all tickets" /></th>
              <th class="py-3 px-4 text-left font-semibold">ID</th>
              <th class="py-3 px-4 text-left font-semibold">Invoice</th>
              <th class="py-3 px-4 text-left font-semibold">Subject</th>
              <th class="py-3 px-4 text-left font-semibold">Priority</th>
              <th class="py-3 px-4 text-left font-semibold">Status</th>
              <th class="py-3 px-4 text-left font-semibold">Assignee</th>
              <th class="py-3 px-4 text-left font-semibold">SLA</th>
              <th class="py-3 px-4 text-left font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filteredTickets" :key="t.id" class="border-t border-slate-200 hover:bg-slate-50 transition">
              <td class="py-3 px-4"><input v-model="selectedIds" :value="t.id" type="checkbox" :aria-label="`Select ticket ${t.id}`" /></td>
              <td class="py-3 px-4">
                <router-link :to="`/tickets/${t.id}`" class="font-mono text-sm text-blue-700 hover:underline font-semibold">
                  {{ t.id }}
                </router-link>
              </td>
              <td class="py-3 px-4 text-slate-600">{{ t.invoiceNumber || '—' }}</td>
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800">{{ t.subject || t.issues || '—' }}</div>
                <div class="text-xs text-slate-500 mt-1">{{ t.description || t.issues || 'No description' }}</div>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex px-2 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                  {{ t.priority || 'Normal' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="statusClass(t.status)">
                  {{ t.status || 'New' }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">
                {{ t.assignedTo || 'Unassigned' }}
              </td>
              <td class="py-3 px-4 text-xs font-medium" :class="slaClass(t)">{{ slaLabel(t) }}</td>
              <td class="py-3 px-4 text-slate-500 text-xs">{{ formatDate(t.createdAt) }}</td>
            </tr>
            <tr v-if="filteredTickets.length===0">
              <td colspan="9" class="py-10 text-center text-slate-500">No tickets match these filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import backend from '../mock/backend'

const tickets = ref([])
const selectedIds = ref([])
const bulkAssignee = ref('')
const bulkStatus = ref('')
const statuses = ['New', 'Assigned', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed']
const searchText = ref('')
const statusFilter = ref('all')
const assigneeFilter = ref('all')
const priorityFilter = ref('all')
const allSelected = computed({
  get: () => filteredTickets.value.length > 0 && filteredTickets.value.every(ticket => selectedIds.value.includes(ticket.id)),
  set: value => { selectedIds.value = value ? filteredTickets.value.map(ticket => ticket.id) : [] }
})

const assigneeOptions = computed(() => {
  const people = new Set()
  tickets.value.forEach(ticket => {
    if (ticket.assignedTo) people.add(ticket.assignedTo)
  })
  return [...people].sort()
})

const filteredTickets = computed(() => {
  const query = searchText.value.trim().toLowerCase()

  return tickets.value.filter(ticket => {
    const matchQuery = !query || [
      ticket.id,
      ticket.invoiceNumber,
      ticket.subject,
      ticket.issues,
      ticket.description,
      ticket.assignedTo,
      ticket.status,
      ticket.priority
    ].filter(Boolean).some(value => String(value).toLowerCase().includes(query))

    const matchStatus = statusFilter.value === 'all' || (ticket.status || 'New') === statusFilter.value
    const matchAssignee = assigneeFilter.value === 'all' || (ticket.assignedTo || 'Unassigned') === assigneeFilter.value
    const matchPriority = priorityFilter.value === 'all' || (ticket.priority || 'Normal') === priorityFilter.value

    return matchQuery && matchStatus && matchAssignee && matchPriority
  })
})

async function load(){
  const list = await backend.getTickets() || []
  tickets.value = list
}

function refresh(){ load() }

function clearFilters(){
  searchText.value = ''
  statusFilter.value = 'all'
  assigneeFilter.value = 'all'
  priorityFilter.value = 'all'
}

function saveCurrentFilter(){
  localStorage.setItem('admin_saved_ticket_view', JSON.stringify({ search: searchText.value, status: statusFilter.value, assignee: assigneeFilter.value, priority: priorityFilter.value }))
}

async function applyBulkActions(){
  if (!bulkAssignee.value && !bulkStatus.value) return
  for (const id of selectedIds.value) {
    const patch = { updatedBy: 'Admin' }
    if (bulkAssignee.value) patch.assignedTo = bulkAssignee.value
    if (bulkStatus.value) patch.status = bulkStatus.value
    await backend.updateTicket(id, patch)
  }
  bulkAssignee.value = ''
  bulkStatus.value = ''
  selectedIds.value = []
  await load()
}

function formatDate(d){ if(!d) return '-'; try{ return new Date(d).toLocaleString() }catch{ return d } }

function statusClass(status){
  if (!status) return 'bg-slate-100 text-slate-700'
  if (status === 'Closed') return 'bg-slate-200 text-slate-700'
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700'
  if (status === 'Waiting for Customer') return 'bg-amber-100 text-amber-700'
  if (status === 'Resolved') return 'bg-emerald-100 text-emerald-700'
  return 'bg-slate-100 text-slate-700'
}

function slaExpired(ticket){ return ticket.status !== 'Resolved' && ticket.status !== 'Closed' && ticket.dueAt && new Date(ticket.dueAt) < new Date() }
function slaLabel(ticket){ return slaExpired(ticket) ? 'Overdue' : ticket.dueAt ? `Due ${formatDate(ticket.dueAt)}` : 'No SLA' }
function slaClass(ticket){ return slaExpired(ticket) ? 'text-red-600' : 'text-slate-500' }

onMounted(() => { load() })
</script>
