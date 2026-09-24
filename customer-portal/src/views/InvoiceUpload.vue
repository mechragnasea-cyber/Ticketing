<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Customer Portal</p>
        <h1 class="text-3xl font-semibold text-slate-800 mt-1">Invoices</h1>
        <p class="text-sm text-slate-500 mt-2">Upload invoice records, validate an invoice, and start a service ticket.</p>
      </div>
      <label class="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium cursor-pointer">
        Upload Excel
        <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileUpload" />
      </label>
    </header>

    <div v-if="uploadMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{{ uploadMessage }}</div>
    <div v-if="uploadError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ uploadError }}</div>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">Invoice List</h2>
          <p class="text-sm text-slate-500">{{ filteredInvoices.length }} invoice records</p>
        </div>
        <input v-model="invoiceSearch" class="border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Search invoice or customer" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left px-5 py-3 font-semibold">Invoice Number</th>
              <th class="text-left px-5 py-3 font-semibold">Customer</th>
              <th class="text-left px-5 py-3 font-semibold">Amount</th>
              <th class="text-left px-5 py-3 font-semibold">Date</th>
              <th class="text-left px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in filteredInvoices" :key="invoice.id || invoice.number" class="border-t border-slate-200 hover:bg-slate-50">
              <td class="px-5 py-3 font-medium text-slate-800">{{ invoice.number }}</td>
              <td class="px-5 py-3 text-slate-600">{{ invoice.customer || '—' }}</td>
              <td class="px-5 py-3 text-slate-600">{{ invoice.amount ? Number(invoice.amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : '—' }}</td>
              <td class="px-5 py-3 text-slate-500">{{ formatDate(invoice.date) }}</td>
              <td class="px-5 py-3"><button @click="useInvoice(invoice.number)" class="text-blue-700 hover:underline font-medium">Create Ticket</button></td>
            </tr>
            <tr v-if="filteredInvoices.length === 0"><td colspan="5" class="px-5 py-10 text-center text-slate-500">No invoices found.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div class="mb-5">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Create Ticket</p>
          <h2 class="text-2xl font-semibold text-slate-800 mt-2">Validate invoice to continue</h2>
        </div>

        <form @submit.prevent="goToCreateTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Invoice Number</label>
            <input v-model="createInvoiceNumber" placeholder="Enter invoice number" class="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div v-if="createError" class="text-sm text-red-600 rounded-lg bg-red-50 border border-red-200 p-3">
            {{ createError }}
          </div>

          <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium">
            Create Ticket
          </button>
        </form>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div class="mb-5">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Check Ticket</p>
          <h2 class="text-2xl font-semibold text-slate-800 mt-2">View ticket history</h2>
        </div>

        <form @submit.prevent="goToCheckTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Ticket Number or Invoice Number</label>
            <input v-model="checkInput" placeholder="Enter ticket number or invoice number" class="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div v-if="checkError" class="text-sm text-red-600 rounded-lg bg-red-50 border border-red-200 p-3">
            {{ checkError }}
          </div>

          <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg font-medium">
            Check Ticket
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import backend from '../mock/backend'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'

const invoices = ref(backend.getInvoices())
const invoiceSearch = ref('')
const uploadMessage = ref('')
const uploadError = ref('')
const createInvoiceNumber = ref('')
const createError = ref('')
const checkInput = ref('')
const checkError = ref('')
const router = useRouter()

const filteredInvoices = computed(() => {
  const query = invoiceSearch.value.trim().toLowerCase()
  if (!query) return invoices.value
  return invoices.value.filter(invoice => [invoice.number, invoice.customer].filter(Boolean).some(value => String(value).toLowerCase().includes(query)))
})

function formatDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleDateString() } catch { return value }
}

function useInvoice(number) {
  router.push({ name: 'CreateTicket', query: { invoice: number } })
}

async function handleFileUpload(event) {
  uploadMessage.value = ''
  uploadError.value = ''
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
        amount: values.amount || '',
        customer: values.customer || values.customername || '',
        date: values.date || new Date().toISOString()
      }
    }).filter(invoice => invoice.number)

    if (!imported.length) {
      uploadError.value = 'No invoice numbers were found. Use a column named Invoice Number, Invoice, or Number.'
      return
    }

    const existingNumbers = new Set(invoices.value.map(invoice => String(invoice.number).toLowerCase()))
    const newInvoices = imported.filter(invoice => !existingNumbers.has(invoice.number.toLowerCase()))
    newInvoices.forEach(invoice => backend.saveInvoice(invoice))
    invoices.value = backend.getInvoices()
    uploadMessage.value = `${newInvoices.length} invoice${newInvoices.length === 1 ? '' : 's'} imported successfully.`
  } catch (error) {
    uploadError.value = 'The file could not be read. Please upload a valid Excel or CSV file.'
  } finally {
    event.target.value = ''
  }
}

function goToCreateTicket() {
  createError.value = ''
  const invoice = createInvoiceNumber.value.trim()

  if (!invoice) {
    createError.value = 'Please enter an invoice number.'
    return
  }

  const valid = backend.validateInvoice(invoice)
  if (!valid) {
    createError.value = 'Invoice not found. Please enter a valid invoice number.'
    return
  }

  router.push({ name: 'CreateTicket', query: { invoice: invoice } })
}

function goToCheckTicket() {
  checkError.value = ''
  const value = checkInput.value.trim()

  if (!value) {
    checkError.value = 'Please enter a ticket number or invoice number.'
    return
  }

  router.push({ name: 'CheckTicket', query: { q: value } })
}
</script>
