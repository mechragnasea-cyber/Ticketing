<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400 font-medium">Administration</p>
        <h2 class="text-3xl font-semibold text-slate-800 mt-1">Invoice Maintenance</h2>
        <p class="text-sm text-slate-500 mt-2">Manage invoice records used for ticket validation.</p>
      </div>
      <label class="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium cursor-pointer">
        Upload Excel
        <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileUpload" />
      </label>
    </header>

    <div v-if="message" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ error }}</div>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Invoice Grid</h3>
          <p class="text-sm text-slate-500">{{ filteredInvoices.length }} invoice records</p>
        </div>
        <input v-model="search" class="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Search invoice or customer" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left px-5 py-3 font-semibold">Invoice Number</th>
              <th class="text-left px-5 py-3 font-semibold">Customer</th>
              <th class="text-left px-5 py-3 font-semibold">Amount</th>
              <th class="text-left px-5 py-3 font-semibold">Date</th>
              <th class="text-left px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in filteredInvoices" :key="invoice.id || invoice.number" class="border-t border-slate-200 hover:bg-slate-50">
              <td class="px-5 py-3 font-medium text-slate-800">{{ invoice.number }}</td>
              <td class="px-5 py-3 text-slate-600">{{ invoice.customer || '—' }}</td>
              <td class="px-5 py-3 text-slate-600">{{ formatAmount(invoice.amount) }}</td>
              <td class="px-5 py-3 text-slate-500">{{ formatDate(invoice.date) }}</td>
              <td class="px-5 py-3"><span class="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Available</span></td>
            </tr>
            <tr v-if="filteredInvoices.length === 0"><td colspan="5" class="px-5 py-10 text-center text-slate-500">No invoices found.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 class="text-lg font-semibold text-slate-800">Excel upload format</h3>
      <p class="text-sm text-slate-600 mt-2">Use columns named Invoice Number, Customer, Amount, and Date. Invoice Number is required.</p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import * as XLSX from 'xlsx'
import backend from '../mock/backend'

const invoices = ref(backend.getInvoices())
const search = ref('')
const message = ref('')
const error = ref('')

const filteredInvoices = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return invoices.value
  return invoices.value.filter(invoice => [invoice.number, invoice.customer].filter(Boolean).some(value => String(value).toLowerCase().includes(query)))
})

function formatDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleDateString() } catch { return value }
}

function formatAmount(value) {
  if (value === '' || value === null || value === undefined) return '—'
  return Number(value).toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

async function handleFileUpload(event) {
  message.value = ''
  error.value = ''
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    const imported = rows.map((row, index) => {
      const values = Object.fromEntries(Object.entries(row).map(([key, value]) => [String(key).trim().toLowerCase().replace(/[^a-z0-9]/g, ''), value]))
      return {
        id: Date.now() + index,
        number: String(values.invoicenumber || values.invoice || values.number || '').trim(),
        customer: values.customer || values.customername || '',
        amount: values.amount || '',
        date: values.date || new Date().toISOString()
      }
    }).filter(invoice => invoice.number)

    if (!imported.length) {
      error.value = 'No invoice numbers were found. Check the required column name.'
      return
    }

    const existing = new Set(invoices.value.map(invoice => String(invoice.number).toLowerCase()))
    const newInvoices = imported.filter(invoice => !existing.has(invoice.number.toLowerCase()))
    newInvoices.forEach(invoice => backend.saveInvoice(invoice))
    invoices.value = backend.getInvoices()
    message.value = `${newInvoices.length} invoice${newInvoices.length === 1 ? '' : 's'} imported successfully.`
  } catch {
    error.value = 'The file could not be read. Upload a valid Excel or CSV file.'
  } finally {
    event.target.value = ''
  }
}
</script>
