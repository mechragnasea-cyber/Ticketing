<template>
  <div class="max-w-lg">
    <h1 class="text-xl font-semibold mb-4">Upload Invoice</h1>
    <form @submit.prevent="upload">
      <div class="mb-3">
        <label class="block text-sm">Invoice Number</label>
        <input v-model="number" class="w-full border p-2 rounded" required />
      </div>
      <div class="mb-3">
        <label class="block text-sm">File</label>
        <input type="file" @change="onFile" accept="application/pdf,image/*" />
      </div>
      <div v-if="error" class="text-red-600">{{ error }}</div>
      <button class="bg-brand text-white px-4 py-2 rounded mt-3">Upload</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
const number = ref('')
const file = ref(null)
const error = ref('')

function onFile(e){ file.value = e.target.files?.[0] }

async function upload(){
  error.value = ''
  if (!number.value || !file.value) { error.value = 'Provide number and file.'; return }
  // simple validation: store record with filename
  const rec = await store.uploadInvoice({ number: number.value, filename: file.value.name, uploadedAt: new Date().toISOString() })
  if (rec) {
    number.value = ''
    file.value = null
    alert('Invoice uploaded and saved.')
  }
}
</script>
