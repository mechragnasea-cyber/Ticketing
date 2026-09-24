<template>
  <div class="min-h-screen flex">
    <SideMenu />
    <div class="flex-1 p-6">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SideMenu from './components/SideMenu.vue'
</script>
