<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Login</h2>
    <div class="mb-2"><input placeholder="Username" class="w-full border p-2 rounded mb-2" v-model="u" /></div>
    <div class="mb-2"><input placeholder="Password" type="password" class="w-full border p-2 rounded" v-model="p" /></div>
    <button @click="login" class="bg-brand text-white px-4 py-2 rounded">Login</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '../store'
const store = useAdminStore(); store.init()
const u = ref('admin'), p = ref('admin')
function login(){ store.user = { username: u.value, role: 'Admin' }; }
</script>
