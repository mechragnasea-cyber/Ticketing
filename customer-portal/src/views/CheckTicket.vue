<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 class="text-2xl font-semibold text-slate-800 mb-4">Check Ticket Status</h2>
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="ticketId" placeholder="Enter ticket number or invoice number" class="flex-1 border border-slate-300 rounded-lg px-3 py-2.5" @keyup.enter="check" />
        <button @click="check" class="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium">
          Check status
        </button>
      </div>
      <div v-if="notFound" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        Ticket not found. Please check the ticket number or invoice number and try again.
      </div>
    </div>

    <div v-if="ticket" class="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between gap-3 mb-5">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Ticket</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-1">#{{ ticket.id }}</h3>
          </div>
          <span class="inline-flex px-3 py-1.5 rounded-full text-sm font-medium" :class="statusClass(ticket.status)">
            {{ ticket.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <div class="text-slate-400 mb-1">Subject</div>
            <div class="font-medium text-slate-800">{{ ticket.subject || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 mb-1">Assigned to</div>
            <div class="font-medium text-slate-800">{{ ticket.assignee || 'Unassigned' }}</div>
          </div>
          <div>
            <div class="text-slate-400 mb-1">Invoice</div>
            <div class="font-medium text-slate-800">{{ ticket.invoiceNumber || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 mb-1">Created</div>
            <div class="font-medium text-slate-800">{{ formatDate(ticket.createdAt) }}</div>
          </div>
        </div>

        <div class="mt-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-3">Description</h4>
          <p class="text-slate-600 whitespace-pre-wrap">{{ ticket.description || 'No description provided.' }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h4 class="text-lg font-semibold text-slate-800 mb-3">Comments</h4>
          <div v-if="ticket.comments?.length" class="space-y-3">
            <div v-for="comment in ticket.comments" :key="comment.id" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-sm font-medium text-slate-700">{{ comment.author }}</span>
                <span class="text-[10px] uppercase tracking-wide text-slate-400">{{ formatDate(comment.time) }}</span>
              </div>
              <p class="text-sm text-slate-600">{{ comment.text }}</p>
            </div>
          </div>
          <div v-else class="text-sm text-slate-500">No comments yet.</div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h4 class="text-lg font-semibold text-slate-800 mb-3">History log</h4>
          <div v-if="historyLogs.length" class="space-y-3">
            <div v-for="log in historyLogs" :key="log.id" class="border-l-2 border-blue-200 pl-3">
              <div class="text-sm font-medium text-slate-700">{{ log.action }}</div>
              <div class="text-sm text-slate-600 mt-1">{{ log.details }}</div>
              <div class="text-[11px] text-slate-400 mt-1">{{ log.userName }} • {{ formatDate(log.time) }}</div>
            </div>
          </div>
          <div v-else class="text-sm text-slate-500">No history available.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import backend from '../mock/backend'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ticketId = ref('')
const ticket = ref(null)
const notFound = ref(false)

const historyLogs = computed(() => Array.isArray(ticket.value?.historyLogs) ? ticket.value.historyLogs : [])

function findTicketByQuery(value) {
  const list = backend.getTickets ? backend.getTickets() : []
  const input = String(value || '').trim()

  if (!input) {
    return null
  }

  return list.find(item => {
    const idMatch = String(item.id) === input
    const invoiceMatch = String(item.invoiceNumber || '').toLowerCase() === input.toLowerCase()
    return idMatch || invoiceMatch
  }) || null
}

function applyLookup(value) {
  const input = String(value || '').trim()
  notFound.value = false
  ticket.value = null

  if (!input) {
    return
  }

  const found = findTicketByQuery(input)
  if (!found) {
    notFound.value = true
    return
  }

  ticket.value = found
  ticketId.value = input
}

function formatDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleString() } catch { return value }
}

function statusClass(status) {
  if (status === 'Closed') return 'bg-slate-200 text-slate-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  if (status === 'in_progress') return 'bg-blue-100 text-blue-700'
  return 'bg-emerald-100 text-emerald-700'
}

function check() {
  applyLookup(ticketId.value)
}

onMounted(() => {
  const q = route.query.q
  if (q) {
    ticketId.value = String(q)
    applyLookup(q)
  }
})

watch(
  () => route.query.q,
  (value) => {
    if (value) {
      ticketId.value = String(value)
      applyLookup(value)
    }
  }
)
</script>
