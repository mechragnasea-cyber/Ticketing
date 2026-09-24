<template>
  <div class="max-w-xl">
    <h1 class="text-xl font-semibold mb-4">Create Ticket (Public)</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="block text-sm">Name</label>
        <input v-model="form.name" class="w-full border p-2 rounded" required />
      </div>
      <div class="mb-3">
        <label class="block text-sm">Email</label>
        <input v-model="form.email" type="email" class="w-full border p-2 rounded" required />
      </div>
      <div class="mb-3">
        <label class="block text-sm">Subject</label>
        <input v-model="form.subject" class="w-full border p-2 rounded" required />
      </div>
      <div class="mb-3">
        <label class="block text-sm">Description</label>
        <textarea v-model="form.description" class="w-full border p-2 rounded" rows="4" required></textarea>
      </div>
      <div class="mb-3">
        <label class="block text-sm">Priority</label>
        <select v-model="form.priority" class="w-full border p-2 rounded">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="block text-sm">Invoice Number (optional)</label>
        <input v-model="form.invoiceNumber" class="w-full border p-2 rounded" />
      </div>
      <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mb-2">{{ success }}</div>
      <button class="bg-brand text-white px-4 py-2 rounded">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useMainStore } from '../store'

const emit = defineEmits(['submitted'])
const store = useMainStore()

const form = reactive({ name:'', email:'', subject:'', description:'', priority:'Low', invoiceNumber: '' })
const error = ref('')
const success = ref('')

async function submit(){
  error.value = ''
  success.value = ''
  if (form.invoiceNumber) {
    const valid = await store.validateInvoice(form.invoiceNumber)
    if (!valid) { error.value = 'Invoice invalid. Please upload or verify invoice first.'; return }
  }
  const saved = await store.submitTicket({ ...form })
  success.value = 'Ticket submitted. ID: ' + saved.id
  emit('submitted', saved)
  Object.assign(form, { name:'', email:'', subject:'', description:'', priority:'Low', invoiceNumber: '' })
}
</script>
