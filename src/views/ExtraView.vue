<template>
  <el-card>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl">Barcha ishchilar</h2>
      <div>
        <el-button type="primary" @click="showAdd = true">Yangi xodim</el-button>
      </div>
    </div>

    <el-input v-model="search" placeholder="Qidirish..." class="mb-4" />

    <el-table :data="filtered" style="width: 100%">
      <el-table-column prop="name" label="Ism" />
      <el-table-column prop="startYear" label="Ishga kirgan yili" />
      <el-table-column label="Holat">
        <template #default="{ row }">
          <span :class="rowStatusClass(row)">
            {{ rowStatusText(row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Amallar">
        <template #default="{ row }">
          <el-button size="small" @click="editRow(row)">Tahrirlash</el-button>
          <el-button size="small" type="danger" @click="remove(row.id)">O'chirish</el-button>
        </template>
      </el-table-column>
    </el-table>

    <EmployeeForm :modelValue="showAdd" @update:modelValue="showAdd = $event" @save="add" />

    <EmployeeForm :modelValue="showEdit" :employee="editing" @update:modelValue="showEdit = $event" @save="saveEdit" />
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmployeeStore } from '@/store/employees'
import EmployeeForm from '@/components/EmployeeForm.vue'

const store = useEmployeeStore()
const search = ref('')
const showAdd = ref(false)
const showEdit = ref(false)
const editing = ref(null)

const filtered = computed(() =>
  store.employees.filter(e => e.name.toLowerCase().includes(search.value.toLowerCase()))
)

function yearsWorked(startYear){
  const hozirgi = new Date().getFullYear()
  return hozirgi - startYear
}

function rowStatusText(row){
  const y1 = yearsWorked(row.startYear) * 1.5
  const y2 = yearsWorked(row.startYear) * 2
  if (y1 >= 12) return 'Nafaqada (1.5 usul bo‘yicha)'
  if (y2 >= 12) return 'Nafaqada (2.0 usul bo‘yicha)'
  // otherwise show how much left for both methods
  const left1 = (12 - y1).toFixed(1)
  const left2 = (12 - y2).toFixed(1)
  return `Qolgani: ${left1} yil (1.5), ${left2} yil (2.0)`
}

function rowStatusClass(row){
  const y1 = yearsWorked(row.startYear) * 1.5
  const y2 = yearsWorked(row.startYear) * 2
  return (y1 >= 12 || y2 >= 12) ? 'text-green-600' : 'text-orange-600'
}

function add(payload){
  store.addEmployee(payload)
}

function editRow(row){
  editing.value = { ...row }
  showEdit.value = true
}

function saveEdit(payload){
  if(editing.value) store.updateEmployee(editing.value.id, payload)
}

function remove(id){
  store.removeEmployee(id)
}
</script>
