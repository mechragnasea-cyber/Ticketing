<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Admin</p>
        <h2 class="text-3xl font-semibold text-slate-800 mt-1">System Maintenance</h2>
      </div>
      <div class="px-3 py-1.5 rounded-full text-sm font-medium border" :class="store.maintenance ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'">
        {{ store.maintenance ? 'Maintenance Active' : 'Normal Mode' }}
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Maintenance Status</h3>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="store.maintenance" type="checkbox" class="sr-only peer" @change="toggleMaintenance" />
            <span class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-700"></span>
            <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></span>
          </label>
        </div>
        <p class="text-sm text-slate-600">
          {{ store.maintenance ? 'The app is currently in maintenance mode and ticket operations are restricted.' : 'The app is running normally and new requests can be processed.' }}
        </p>
        <div class="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
          Maintenance window: {{ store.maintenance ? 'Scheduled overnight update' : 'No active maintenance window' }}
        </div>
      </section>

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Assignment Permissions</h3>
        <div class="space-y-3">
          <div v-for="member in members" :key="member.id" class="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <div class="font-medium text-slate-800">{{ member.name }}</div>
              <div class="text-xs text-slate-500">{{ member.role }}</div>
            </div>
            <label class="inline-flex items-center gap-2 text-sm text-slate-600">
              <input v-model="member.canAssign" type="checkbox" @change="saveMembers" />
              Can assign
            </label>
          </div>
        </div>
      </section>
    </div>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Role Management</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="role in roles" :key="role.name" class="rounded-lg border border-slate-200 p-4 bg-slate-50">
          <div class="flex items-center justify-between gap-3 mb-2">
            <div class="font-semibold text-slate-800">{{ role.name }}</div>
            <span class="px-2 py-1 text-[10px] uppercase tracking-wide rounded-full bg-blue-100 text-blue-700">{{ role.level }}</span>
          </div>
          <ul class="text-sm text-slate-600 space-y-1">
            <li v-for="item in role.access" :key="item">• {{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Team Members</h3>
      <div class="flex flex-col md:flex-row gap-3 mb-4">
        <input v-model="newMemberName" class="flex-1 border border-slate-300 rounded-lg px-3 py-2" placeholder="Add team member name" />
        <select v-model="newMemberRole" class="border border-slate-300 rounded-lg px-3 py-2">
          <option value="Admin">Admin</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Support Agent">Support Agent</option>
          <option value="Viewer">Viewer</option>
        </select>
        <button @click="addMember" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg">Add member</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="py-2 px-3 text-left">Name</th>
              <th class="py-2 px-3 text-left">Role</th>
              <th class="py-2 px-3 text-left">Assign rights</th>
              <th class="py-2 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id" class="border-t border-slate-200">
              <td class="py-2 px-3 font-medium text-slate-800">{{ member.name }}</td>
              <td class="py-2 px-3">
                <select v-model="member.role" @change="saveMembers" class="border border-slate-300 rounded px-2 py-1">
                  <option>Admin</option>
                  <option>Supervisor</option>
                  <option>Support Agent</option>
                  <option>Viewer</option>
                </select>
              </td>
              <td class="py-2 px-3">
                <input v-model="member.canAssign" type="checkbox" @change="saveMembers" />
              </td>
              <td class="py-2 px-3">
                <button @click="removeMember(member.id)" class="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Data Management</h3>
      <div class="flex flex-wrap gap-3">
        <button @click="seedData" class="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">Seed sample data</button>
        <button @click="clearTickets" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Clear tickets</button>
        <button @click="clearInvoices" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Clear invoices</button>
      </div>
      <div class="mt-3 text-sm text-slate-500">Seeding will create sample ticket and invoice records for testing.</div>
    </section>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">System Info</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-3"><span class="text-slate-500 block">Tickets</span><strong class="text-xl">{{ store.tickets.length }}</strong></div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-3"><span class="text-slate-500 block">Invoices</span><strong class="text-xl">{{ store.invoices.length }}</strong></div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-3"><span class="text-slate-500 block">Assignable users</span><strong class="text-xl">{{ members.filter(m => m.canAssign).length }}</strong></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../store'

const store = useAdminStore()
store.init()

const defaultMembers = [
  { id: 1, name: 'John Smith', role: 'Supervisor', canAssign: true },
  { id: 2, name: 'Sarah Lee', role: 'Support Agent', canAssign: true },
  { id: 3, name: 'David Kim', role: 'Support Agent', canAssign: false },
  { id: 4, name: 'Maria Gomez', role: 'Admin', canAssign: true }
]

const roles = ref([
  { name: 'Admin', level: 'Full', access: ['Manage tickets', 'Change roles', 'Maintain system'] },
  { name: 'Supervisor', level: 'High', access: ['Assign tickets', 'Review escalations', 'Approve changes'] },
  { name: 'Support Agent', level: 'Medium', access: ['Update tickets', 'Add comments', 'Resolve cases'] },
  { name: 'Viewer', level: 'Low', access: ['View records', 'Read ticket history'] }
])

const members = ref([])
const newMemberName = ref('')
const newMemberRole = ref('Support Agent')

function loadMembers(){
  const saved = JSON.parse(localStorage.getItem('admin_members') || 'null')
  members.value = saved && saved.length ? saved : [...defaultMembers]
  localStorage.setItem('admin_members', JSON.stringify(members.value))
}

function saveMembers(){
  localStorage.setItem('admin_members', JSON.stringify(members.value))
}

function addMember(){
  const name = newMemberName.value.trim()
  if (!name) return

  members.value.unshift({
    id: Date.now(),
    name,
    role: newMemberRole.value,
    canAssign: newMemberRole.value === 'Admin' || newMemberRole.value === 'Supervisor'
  })

  newMemberName.value = ''
  newMemberRole.value = 'Support Agent'
  saveMembers()
}

function removeMember(id){
  members.value = members.value.filter(member => member.id !== id)
  saveMembers()
}

function toggleMaintenance(){
  localStorage.setItem('admin_maintenance', JSON.stringify(store.maintenance))
}

function seedData(){
  const now = Date.now()
  const t = [
    { id: now-40000, refId: 'REQ-102', subject: 'Login Issue', issues: 'Cannot login to system', status: 'in_progress', priority: 'High', assignedTo: 'John Smith', createdAt: new Date().toISOString() },
    { id: now-30000, refId: 'INC-215', subject: 'Network Outage', issues: 'Network down in 2nd floor', status: 'Open', priority: 'Critical', assignedTo: null, createdAt: new Date().toISOString() },
    { id: now-20000, refId: 'SUP-340', subject: 'Software Installation', issues: 'Install accounting software', status: 'Pending', priority: 'Medium', assignedTo: 'Sarah Lee', createdAt: new Date().toISOString() }
  ]
  localStorage.setItem('admin_tickets', JSON.stringify(t))
  store.init()
}

function clearTickets(){ localStorage.removeItem('admin_tickets'); store.init() }
function clearInvoices(){ localStorage.removeItem('admin_invoices'); store.init() }

onMounted(() => {
  loadMembers()
  store.init()
})
</script>
