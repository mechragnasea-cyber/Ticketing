<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Analytics</p>
        <h2 class="text-3xl font-semibold text-slate-800 mt-1">Reports</h2>
      </div>
      <button @click="downloadReport('Business Operations Summary')" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Download Excel
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div class="text-sm text-slate-500">Open tickets</div>
        <div class="mt-2 text-3xl font-bold text-slate-800">128</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div class="text-sm text-slate-500">Resolved today</div>
        <div class="mt-2 text-3xl font-bold text-slate-800">42</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div class="text-sm text-slate-500">Avg. resolution</div>
        <div class="mt-2 text-3xl font-bold text-slate-800">3.8d</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div class="text-sm text-slate-500">SLA compliance</div>
        <div class="mt-2 text-3xl font-bold text-slate-800">94%</div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Business summary</h3>
        <div class="space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Escalated tickets</span>
            <strong class="text-slate-800">14</strong>
          </div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Assigned to support team</span>
            <strong class="text-slate-800">26</strong>
          </div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Pending approvals</span>
            <strong class="text-slate-800">9</strong>
          </div>
          <div class="flex items-center justify-between">
            <span>Maintenance incidents</span>
            <strong class="text-slate-800">3</strong>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Common report types</h3>
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Daily support overview</li>
          <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Ticket backlog & SLA report</li>
          <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Team performance summary</li>
          <li class="p-3 rounded-lg bg-slate-50 border border-slate-200">Maintenance / outage report</li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Exports</p>
          <h3 class="text-xl font-semibold text-slate-800 mt-1">Business-ready reports</h3>
        </div>
        <span class="text-sm text-slate-500">CSV format opens in Excel</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Select report template</label>
          <select v-model="selectedReport" class="w-full border border-slate-300 rounded-lg px-3 py-2.5">
            <option value="Daily Support Summary">Daily support summary</option>
            <option value="Ticket Backlog & SLA Report">Ticket backlog & SLA report</option>
            <option value="Team Performance Summary">Team performance summary</option>
            <option value="Maintenance & Outage Summary">Maintenance & outage summary</option>
          </select>
        </div>
        <button @click="downloadSelectedReport" class="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium">
          Export selected report
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
        <div v-for="report in reportTemplates" :key="report.name" class="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <div class="font-medium text-slate-800">{{ report.name }}</div>
          <div class="text-sm text-slate-500 mt-1">{{ report.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedReport = ref('Daily Support Summary')
const reportTemplates = [
  { name: 'Daily support summary', description: 'Volume, resolution, and SLA performance.' },
  { name: 'Ticket backlog & SLA', description: 'Open queue, overdue work, and queue age.' },
  { name: 'Team performance', description: 'Assignments, closures, and response trends.' },
  { name: 'Maintenance & outage', description: 'Incidents, outages, and recovery performance.' }
]

function downloadReport(reportName) {
  const rows = [
    ['Report Name', 'Value'],
    ['Business summary', reportName],
    ['Open tickets', '128'],
    ['Resolved today', '42'],
    ['Avg resolution', '3.8 days'],
    ['SLA compliance', '94%'],
    ['Escalated tickets', '14'],
    ['Pending approvals', '9'],
    ['Maintenance incidents', '3']
  ]

  const csv = rows.map(r => r.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reportName.replace(/\s+/g, '-').toLowerCase()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function downloadSelectedReport() {
  const reportData = {
    'Daily Support Summary': [
      ['Report', 'Daily Support Summary'], ['Open tickets', '128'], ['Resolved today', '42'], ['Avg resolution', '3.8 days'], ['SLA compliance', '94%']
    ],
    'Ticket Backlog & SLA Report': [
      ['Report', 'Ticket Backlog & SLA Report'], ['Escalated tickets', '14'], ['Pending approvals', '9'], ['Queue age', '2.4 days'], ['SLA breached', '6']
    ],
    'Team Performance Summary': [
      ['Report', 'Team Performance Summary'], ['Assigned to support team', '26'], ['Closed by team', '18'], ['Avg response time', '1.2 hours'], ['Top performer', 'Sarah Lee']
    ],
    'Maintenance & Outage Summary': [
      ['Report', 'Maintenance & Outage Summary'], ['Maintenance incidents', '3'], ['Outages', '2'], ['Resolved within SLA', '91%'], ['Next maintenance window', 'Saturday 02:00']
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
