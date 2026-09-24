<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-slate-900 text-white shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <router-link to="/" class="text-lg font-bold">JONECOTECH</router-link>
          <div class="text-xs text-slate-300">Customer Service Portal</div>
        </div>
        <nav class="flex flex-wrap gap-2 text-sm">
          <router-link to="/create-ticket" class="px-3 py-2 rounded-lg hover:bg-slate-700" active-class="bg-blue-700">Create Ticket</router-link>
          <router-link to="/check-ticket" class="px-3 py-2 rounded-lg hover:bg-slate-700" active-class="bg-blue-700">Check Ticket Status</router-link>
        </nav>
      </div>
    </header>
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
