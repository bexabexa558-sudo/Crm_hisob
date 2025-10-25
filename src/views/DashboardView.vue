<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 p-4 bg-gray-50">
      <Navbar />
   
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>
