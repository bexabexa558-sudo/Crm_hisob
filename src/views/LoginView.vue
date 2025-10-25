<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <el-card class="w-96 shadow-lg">
      <h2 class="text-center mb-4 text-lg font-bold">🔐 Tizimga kirish</h2>

      <el-form @submit.prevent="login" label-position="top">
        <el-form-item label="Login">
          <el-input v-model="username" placeholder="" />
        </el-form-item>

        <el-form-item label="Parol">
          <el-input
            type="password"
            v-model="password"
            show-password
            placeholder=""
          />
        </el-form-item>

        <el-button type="primary" block native-type="submit">Kirish</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref('')
const password = ref('')

function login() {
  if (username.value === 'admin' && password.value === '123') {
    // Kirish muvaffaqiyatli bo‘lsa:
    localStorage.setItem('loggedIn', 'true')

    ElMessage({
      message: '🎉 Tizimga xush kelibsiz!',
      type: 'success',
      duration: 2500,
      offset: 60,
    })

    router.push('/dashboard/main')
  } else {
    ElMessage.error('❌ Login yoki parol noto‘g‘ri!')
  }
}
</script>
