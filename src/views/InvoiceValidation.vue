<template>
  <div class="max-w-md">
    <h1 class="text-xl font-semibold mb-4">Validate Invoice</h1>
    <form @submit.prevent="validate">
      <div class="mb-3">
        <label class="block text-sm">Invoice Number</label>
        <input v-model="number" class="w-full border p-2 rounded" required />
      </div>
      <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
      <button class="bg-brand text-white px-4 py-2 rounded">Validate</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useMainStore()
const number = ref('')
const error = ref('')

async function validate(){
  error.value = ''
  if (!number.value) { error.value = 'Provide invoice number'; return }
  const inv = await store.validateInvoice(number.value)
  if (!inv) { error.value = 'Invoice not found. Please upload or check number.'; return }
  // redirect to service-order with invoice query
  router.push({ name: 'ServiceOrder', query: { invoice: number.value } })
}
</script>
