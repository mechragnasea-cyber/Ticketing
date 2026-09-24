<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <header>
      <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Customer Service Portal</p>
      <h1 class="text-3xl font-semibold text-slate-800 mt-1">How can we help?</h1>
      <p class="text-slate-500 mt-2">Create a service ticket or check the progress of an existing request.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-xs uppercase tracking-[0.2em] text-blue-600 font-medium">New request</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-2">Create Ticket</h2>
        <p class="text-sm text-slate-500 mt-2">Enter and validate your invoice number before submitting a service request.</p>

        <form @submit.prevent="createTicket" class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Invoice Number</label>
            <input v-model="invoiceNumber" placeholder="Enter invoice number" class="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div v-if="createError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ createError }}</div>
          <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium">Create Ticket</button>
        </form>
      </section>

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-600 font-medium">Existing request</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-2">Check Status</h2>
        <p class="text-sm text-slate-500 mt-2">Use your ticket number or invoice number to view details and history.</p>

        <form @submit.prevent="checkTicket" class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Ticket Number or Invoice Number</label>
            <input v-model="ticketQuery" placeholder="Enter ticket or invoice number" class="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div v-if="checkError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ checkError }}</div>
          <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg font-medium">Check Ticket</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import backend from '../mock/backend'

const router = useRouter()
const invoiceNumber = ref('')
const ticketQuery = ref('')
const createError = ref('')
const checkError = ref('')

function createTicket() {
  createError.value = ''
  const value = invoiceNumber.value.trim()
  if (!value) {
    createError.value = 'Please enter an invoice number.'
    return
  }
  if (!backend.validateInvoice(value)) {
    createError.value = 'Invoice not found. Please enter a valid invoice number.'
    return
  }
  router.push({ name: 'CreateTicket', query: { invoice: value } })
}

function checkTicket() {
  checkError.value = ''
  const value = ticketQuery.value.trim()
  if (!value) {
    checkError.value = 'Please enter a ticket number or invoice number.'
    return
  }
  router.push({ name: 'CheckTicket', query: { q: value } })
}
</script>
