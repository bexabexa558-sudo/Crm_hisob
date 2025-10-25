<template>
  <div class="w-60 bg-gray-800 text-white p-4 min-h-screen">
    <h2 class="text-xl font-bold mb-6">Menyu</h2>
    <el-menu router default-active="/dashboard/main" class="bg-transparent" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/dashboard/main">Asosiy</el-menu-item>
      <el-menu-item index="/dashboard/extra">Qo'shimcha</el-menu-item>
    </el-menu>
  </div>
</template>
