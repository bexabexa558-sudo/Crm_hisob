<template>
  <el-header class="flex justify-between items-center bg-blue-50 px-4 py-2">
    <h2 class="font-semibold text-lg">👨‍💼 Nafaqa Hisob Tizimi</h2>
    <el-button type="danger" @click="logout">🚪 Chiqish</el-button>
  </el-header>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

function logout() {
  localStorage.removeItem('loggedIn')

  ElMessage({
    message: '🚪 Tizimdan chiqdingiz!',
    type: 'warning',
    duration: 2500,
    offset: 60,
  })

  router.push('/')
}
</script>
