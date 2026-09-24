<template>
  <div class="space-y-6">
    <header>
      <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Administration</p>
      <h2 class="text-3xl font-semibold text-slate-800 mt-1">Reports Management</h2>
    </header>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-3">Business-ready report templates</h3>
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Daily support summary</li>
            <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Ticket backlog and SLA report</li>
            <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Team performance report</li>
            <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Maintenance and outage summary</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-3">Generate export</h3>
          <div class="space-y-3">
            <select v-model="selectedReport" class="w-full border border-slate-300 rounded-lg px-3 py-2.5">
              <option value="Daily Support Summary">Daily support summary</option>
              <option value="Ticket Backlog & SLA Report">Ticket backlog & SLA report</option>
              <option value="Team Performance Summary">Team performance summary</option>
              <option value="Maintenance & Outage Summary">Maintenance & outage summary</option>
            </select>
            <button @click="downloadSelectedReport" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg">
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedReport = ref('Daily Support Summary')

function downloadSelectedReport() {
  const reportData = {
    'Daily Support Summary': [
      ['Report', 'Daily Support Summary'],
      ['Open tickets', '128'],
      ['Resolved today', '42'],
      ['Avg resolution', '3.8 days'],
      ['SLA compliance', '94%']
    ],
    'Ticket Backlog & SLA Report': [
      ['Report', 'Ticket Backlog & SLA Report'],
      ['Escalated tickets', '14'],
      ['Pending approvals', '9'],
      ['Queue age', '2.4 days'],
      ['SLA breached', '6']
    ],
    'Team Performance Summary': [
      ['Report', 'Team Performance Summary'],
      ['Assigned to support team', '26'],
      ['Closed by team', '18'],
      ['Avg response time', '1.2 hours'],
      ['Top performer', 'Sarah Lee']
    ],
    'Maintenance & Outage Summary': [
      ['Report', 'Maintenance & Outage Summary'],
      ['Maintenance incidents', '3'],
      ['Outages', '2'],
      ['Resolved within SLA', '91%'],
      ['Next maintenance window', 'Saturday 02:00']
    ]
  }

  const rows = reportData[selectedReport.value] || reportData['Daily Support Summary']
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${selectedReport.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>
