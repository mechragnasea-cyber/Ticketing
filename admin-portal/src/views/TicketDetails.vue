<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <router-link to="/tickets" class="inline-flex items-center text-sm text-blue-700 hover:underline mb-2">
          ← Back to Ticket Management
        </router-link>
        <h2 class="text-3xl font-semibold text-slate-800">Ticket Details</h2>
      </div>
      <div class="px-3 py-1.5 rounded-full text-sm font-medium border" :class="statusBadgeClass(ticket?.status)">
        {{ ticket?.status || 'Open' }}
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6 text-slate-500">Loading ticket...</div>

    <div v-else-if="ticket" class="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Ticket ID</p>
              <h3 class="mt-1 text-2xl font-bold text-slate-800">{{ ticket.id }}</h3>
            </div>
            <button @click="saveChanges" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Save changes
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input v-model="form.subject" class="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="Ticket subject" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select v-model="form.priority" class="w-full border border-slate-300 rounded-lg px-3 py-2.5">
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select v-model="form.status" class="w-full border border-slate-300 rounded-lg px-3 py-2.5">
                <option>New</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Waiting for Customer</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
              <select v-model="form.assignedTo" class="w-full border border-slate-300 rounded-lg px-3 py-2.5">
                <option value="Unassigned">Unassigned</option>
                <option v-for="member in teamMembers" :key="member" :value="member">{{ member }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea v-model="form.description" rows="6" class="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="Describe the issue..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Add comment</label>
            <div class="flex gap-3">
              <textarea v-model="newComment" rows="3" class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5" placeholder="Add an internal note or update..."></textarea>
              <button @click="addComment" class="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium self-start">Add comment</button>
            </div>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Ticket summary</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between gap-3">
              <dt class="text-slate-500">Requester</dt>
              <dd class="font-medium text-slate-800">{{ ticket.requester || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-500">Invoice</dt>
              <dd class="font-medium text-slate-800">{{ ticket.invoiceNumber || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-500">Created</dt>
              <dd class="font-medium text-slate-800">{{ formatDate(ticket.createdAt) }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-500">Assigned by</dt>
              <dd class="font-medium text-slate-800">{{ ticket.assignedBy || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-500">SLA deadline</dt>
              <dd class="font-medium" :class="slaExpired ? 'text-red-600' : 'text-slate-800'">{{ formatDate(ticket.dueAt) }}<span v-if="slaExpired"> (overdue)</span></dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Comments</h3>
          <div v-if="ticket.comments?.length" class="space-y-3">
            <div v-for="comment in ticket.comments" :key="comment.id" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-sm font-medium text-slate-700">{{ comment.author }}</span>
                <span class="text-[10px] uppercase tracking-wide text-slate-400">{{ formatDate(comment.time) }}</span>
              </div>
              <p class="text-sm text-slate-600 whitespace-pre-wrap">{{ comment.text }}</p>
            </div>
          </div>
          <div v-else class="text-sm text-slate-500">No comments yet.</div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">History</h3>
          <div v-if="historyLogs.length" class="space-y-3">
            <div v-for="log in historyLogs" :key="log.id" class="border-l-2 border-blue-200 pl-3">
              <div class="text-sm font-medium text-slate-700">{{ log.action }}</div>
              <div class="text-sm text-slate-600 mt-1">{{ log.details }}</div>
              <div class="text-[11px] text-slate-400 mt-1">{{ log.userName }} • {{ formatDate(log.time) }}</div>
            </div>
          </div>
          <div v-else class="text-sm text-slate-500">No history available.</div>
        </div>
      </aside>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm p-6 text-slate-500">Ticket not found.</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import backend from '../mock/backend'

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const loading = ref(true)
const newComment = ref('')
const teamMembers = ['John Smith', 'Sarah Lee', 'David Kim', 'Maria Gomez', 'Support Team']

const form = ref({
  subject: '',
  description: '',
  priority: 'Normal',
  status: 'New',
  assignedTo: 'Unassigned'
})

const historyLogs = computed(() => Array.isArray(ticket.value?.historyLogs) ? ticket.value.historyLogs : [])
const slaExpired = computed(() => ticket.value?.dueAt && !['Resolved', 'Closed'].includes(ticket.value.status) && new Date(ticket.value.dueAt) < new Date())

function formatDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleString() } catch { return value }
}

function statusBadgeClass(status) {
  if (status === 'Closed') return 'bg-slate-100 text-slate-700 border-slate-200'
  if (status === 'in_progress') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

function syncForm(value) {
  if (!value) return
  form.value = {
    subject: value.subject || '',
    description: value.description || value.issues || '',
    priority: value.priority || 'Normal',
    status: value.status || 'New',
    assignedTo: value.assignedTo || 'Unassigned'
  }
}

async function loadTicket() {
  loading.value = true
  try {
    const list = await backend.getTickets() || []
    const matched = list.find(item => String(item.id) === String(route.params.id))
    ticket.value = matched || null
    syncForm(matched)
  } finally {
    loading.value = false
  }
}

async function saveChanges() {
  if (!ticket.value) return

  const payload = {
    subject: form.value.subject,
    description: form.value.description,
    priority: form.value.priority,
    status: form.value.status,
    assignedTo: form.value.assignedTo,
    updatedBy: 'Admin'
  }

  const updated = await backend.updateTicket(ticket.value.id, payload)
  if (updated) {
    ticket.value = updated
    syncForm(updated)
  }
}

async function addComment() {
  if (!ticket.value || !newComment.value.trim()) return

  const nextComments = [
    ...(Array.isArray(ticket.value.comments) ? ticket.value.comments : []),
    {
      id: Date.now(),
      author: 'Admin',
      text: newComment.value.trim(),
      time: new Date().toISOString()
    }
  ]

  const updated = await backend.updateTicket(ticket.value.id, {
    comments: nextComments,
    updatedBy: 'Admin'
  })

  if (updated) {
    ticket.value = updated
    newComment.value = ''
  }
}

onMounted(loadTicket)
watch(() => route.params.id, loadTicket)
</script>
