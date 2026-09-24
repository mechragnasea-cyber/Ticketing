<template>
  <div class="max-w-sm">
    <h1 class="text-xl font-semibold mb-4">Login / Register</h1>
    <form @submit.prevent="doLogin">
      <div class="mb-2"><input v-model="username" placeholder="Username" class="w-full border p-2" required /></div>
      <div class="mb-2"><input v-model="password" placeholder="Password" type="password" class="w-full border p-2" required /></div>
      <div class="flex gap-2">
        <button class="bg-brand text-white px-4 py-2 rounded">Login</button>
        <button @click.prevent="doRegister" class="bg-gray-200 px-4 py-2 rounded">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()
const username = ref('')
const password = ref('')

async function doLogin(){
  try {
    await store.login(username.value, password.value)
    router.push('/')
  } catch (error) {
    alert(error.message || 'Invalid credentials')
  }
}
async function doRegister(){
  try {
    await store.register(username.value, password.value)
    router.push('/')
  } catch (error) {
    alert(error.message || 'Registration failed')
  }
}
</script>
