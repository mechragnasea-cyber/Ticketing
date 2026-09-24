<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Operations</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-1">Dashboard</h2>
      </div>
      <div class="text-sm text-slate-500">Updated {{ lastUpdated }}</div>
    </div>

    <!-- Top summary tiles -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Assigned to Me</div>
          <div class="text-2xl font-bold">{{ assignedCount }}</div>
        </div>
        <div class="text-3xl text-blue-700">👤</div>
      </div>
      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Tickets for Approval</div>
          <div class="text-2xl font-bold">{{ approvalCount }}</div>
        </div>
        <div class="text-3xl text-green-600">🟢</div>
      </div>
      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Active Tickets</div>
          <div class="text-2xl font-bold">{{ stats.active }}</div>
        </div>
        <div class="text-3xl text-teal-600">📥</div>
      </div>
      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Resolved</div>
          <div class="text-2xl font-bold">{{ stats.resolved }}</div>
        </div>
        <div class="text-3xl text-amber-500">✅</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left column: lists -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">My Assigned Tickets</h3>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-600 border-b">
                <th class="py-2">Ticket ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in assignedTickets" :key="t.id" class="hover:bg-slate-50 cursor-pointer" @click="selectTicket(t)">
                <td class="py-2 font-mono text-xs">{{ displayId(t) }}</td>
                <td>{{ t.subject || t.issues || '—' }}</td>
                <td><span class="px-2 py-1 rounded text-xs" :class="statusClass(t.status)">{{ t.status }}</span></td>
                <td class="text-sm">{{ t.priority || 'Normal' }}</td>
              </tr>
              <tr v-if="assignedTickets.length===0"><td colspan="4" class="py-6 text-center text-slate-500">No assigned tickets</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-3">Tickets Awaiting Approval</h3>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-600 border-b">
                <th class="py-2">Ticket ID</th>
                <th>Title</th>
                <th>Requester</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in approvalTickets" :key="t.id" class="hover:bg-slate-50 cursor-pointer" @click="selectTicket(t)">
                <td class="py-2 font-mono text-xs">{{ displayId(t) }}</td>
                <td>{{ t.subject || t.issues || '—' }}</td>
                <td>{{ t.requester || '—' }}</td>
              </tr>
              <tr v-if="approvalTickets.length===0"><td colspan="3" class="py-6 text-center text-slate-500">No tickets awaiting approval</td></tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white p-4 rounded shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Status Distribution</h3>
            <span class="text-xs text-slate-500">{{ store.tickets.length }} total</span>
          </div>
          <div class="space-y-3">
            <div v-for="item in statusDistribution" :key="item.status">
              <div class="flex justify-between text-sm mb-1"><span>{{ item.status }}</span><strong>{{ item.count }}</strong></div>
              <div class="h-2 rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-blue-600" :style="{ width: `${item.percent}%` }"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: ticket details -->
      <div>
        <div class="bg-white p-4 rounded shadow mb-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Notifications</h3>
            <button v-if="unreadNotifications" @click="markNotificationsRead" class="text-xs text-blue-700 hover:underline">Mark all read</button>
          </div>
          <div v-if="notifications.length" class="space-y-2">
            <router-link v-for="notification in notifications.slice(0, 5)" :key="notification.id" :to="notification.ticketId ? `/tickets/${notification.ticketId}` : '/tickets'" class="block rounded-lg p-3 text-sm hover:bg-slate-50" :class="notification.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50 text-blue-900'">
              <div class="font-medium">{{ notification.message }}</div>
              <div class="text-xs opacity-70 mt-1">{{ formatDate(notification.createdAt) }}</div>
            </router-link>
          </div>
          <div v-else class="text-sm text-slate-500">No notifications yet.</div>
        </div>
        <div class="bg-white p-4 rounded shadow mb-4">
          <h3 class="font-semibold mb-3">SLA and Resolution</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded bg-red-50 border border-red-100 p-3"><span class="text-red-600 block">Overdue</span><strong class="text-2xl text-red-700">{{ overdueCount }}</strong></div>
            <div class="rounded bg-emerald-50 border border-emerald-100 p-3"><span class="text-emerald-600 block">Avg. resolution</span><strong class="text-2xl text-emerald-700">{{ averageResolutionHours }}h</strong></div>
          </div>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold">Ticket Details <span v-if="selected">({{ displayId(selected) }})</span></h3>
          <div v-if="selected" class="mt-3">
            <div class="text-lg font-bold">{{ selected.subject || selected.issues || 'No title' }}</div>
            <div class="mt-2 text-sm text-slate-600">Status: <strong class="ml-1">{{ selected.status }}</strong></div>
            <div class="mt-1 text-sm text-slate-600">Assigned To: <strong class="ml-1">{{ selected.assignedTo || 'Me' }}</strong></div>
            <div class="mt-2 p-3 bg-slate-50 rounded text-sm">{{ selected.description || selected.issues || 'No further details' }}</div>

            <div class="mt-3">
              <h4 class="text-sm font-medium">Comments</h4>
              <div v-for="c in comments" :key="c.id" class="mt-2 p-2 bg-white border rounded">
                <div class="text-xs text-slate-500">{{ c.author }} • {{ c.time }}</div>
                <div class="mt-1">{{ c.text }}</div>
              </div>
              <div class="mt-3 flex gap-2">
                <input v-model="newComment" class="flex-1 border p-2 rounded" placeholder="Add a comment..." />
                <button @click="addComment" class="bg-blue-800 text-white px-3 py-1 rounded">Add</button>
              </div>
            </div>

            <div class="mt-3">
              <h4 class="text-sm font-medium">Status History</h4>
              <ul class="mt-2 list-none">
                <li v-for="(h, idx) in statusHistory" :key="idx" class="flex items-center justify-between py-2 border-b">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full" :style="{ background: statusDotColor(h.status) }"></span><div class="text-sm">{{ h.status }}</div></div>
                  <div class="text-xs text-slate-500">{{ h.time }}</div>
                </li>
                <li v-if="statusHistory.length===0" class="py-4 text-center text-slate-500">No history available</li>
              </ul>
            </div>
          </div>
          <div v-else class="py-8 text-center text-slate-500">Select a ticket to view details</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAdminStore } from '../store'

const store = useAdminStore(); store.init()
const notifications = ref([])
try { notifications.value = JSON.parse(localStorage.getItem('admin_notifications') || '[]') } catch { notifications.value = [] }
const unreadNotifications = computed(() => notifications.value.filter(item => !item.read).length)
function markNotificationsRead(){
  notifications.value = notifications.value.map(item => ({ ...item, read: true }))
  localStorage.setItem('admin_notifications', JSON.stringify(notifications.value))
}
const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const stats = computed(()=>({ active: store.tickets.filter(t=>!['Resolved', 'Closed'].includes(t.status)).length, resolved: store.tickets.filter(t=>['Resolved', 'Closed'].includes(t.status)).length }))

const assignedCount = computed(()=> store.tickets.filter(t=>t.assignedTo==='Me' || t.assignedTo==null).length)
const approvalCount = computed(()=> store.tickets.filter(t=>t.needsApproval).length)

const assignedTickets = computed(()=> store.tickets.filter(t=>t.assignedTo==='Me' || t.assignedTo==null).slice(0,5))
const approvalTickets = computed(()=> store.tickets.filter(t=>t.needsApproval).slice(0,5))
const overdueCount = computed(() => store.tickets.filter(t => t.dueAt && !['Resolved', 'Closed'].includes(t.status) && new Date(t.dueAt) < new Date()).length)
const averageResolutionHours = computed(() => {
  const resolved = store.tickets.filter(t => t.resolvedAt && t.createdAt)
  if (!resolved.length) return '—'
  return Math.round(resolved.reduce((total, ticket) => total + (new Date(ticket.resolvedAt) - new Date(ticket.createdAt)) / 3600000, 0) / resolved.length)
})
const statusDistribution = computed(() => {
  const statuses = ['New', 'Assigned', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed']
  const total = store.tickets.length || 1
  return statuses.map(status => {
    const count = store.tickets.filter(ticket => ticket.status === status).length
    return { status, count, percent: Math.round(count / total * 100) }
  }).filter(item => item.count || store.tickets.length === 0)
})

const selected = ref(null)
const comments = ref([])
const newComment = ref('')

function selectTicket(t){ selected.value = t; loadComments(t) }
function displayId(t){ return t && t.refId ? t.refId : (t ? t.id : '') }
function formatDate(value){ if(!value) return '—'; try { return new Date(value).toLocaleString() } catch { return value } }
function statusClass(s){ if(!s) return 'bg-slate-100'; if(s==='New') return 'bg-green-100 text-green-800'; if(s==='In Progress') return 'bg-blue-100 text-blue-800'; if(s==='Closed') return 'bg-slate-100 text-slate-700'; return 'bg-yellow-100 text-yellow-800' }
function statusDotColor(s){ if(!s) return '#94a3b8'; if(s==='New') return '#10b981'; if(s==='In Progress') return '#1e40af'; if(s==='Closed') return '#64748b'; return '#f59e0b' }

function loadComments(t){
  try{
    const key = 'admin_comments_' + (t.id||'')
    comments.value = JSON.parse(localStorage.getItem(key)||'[]')
  }catch(e){ comments.value = [] }
}

function addComment(){
  if(!selected.value || !newComment.value) return
  const c = { id: Date.now(), author: 'Me', time: new Date().toLocaleString(), text: newComment.value }
  comments.value.push(c)
  const key = 'admin_comments_' + (selected.value.id||'')
  localStorage.setItem(key, JSON.stringify(comments.value))
  newComment.value = ''
}

const statusHistory = computed(()=>{
  if(!selected.value) return []
  // if ticket has a statusHistory field use it, else create a simple history from createdAt and current status
  if(selected.value.statusHistory) return selected.value.statusHistory
  return [{ status: 'Created', time: new Date(selected.value.createdAt).toLocaleString() }, { status: selected.value.status, time: new Date().toLocaleString() }]
})
</script>
