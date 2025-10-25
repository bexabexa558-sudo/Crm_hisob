<template>
  <el-dialog :model-value="visible" title="Xodim qo'shish" width="650px" @close="onClose">
    <el-form @submit.prevent="saveData">
      <el-form-item label="Ism">
        <el-input v-model="local.name" placeholder="Masalan: Bexruz" />
      </el-form-item>

      <el-divider>Ish davrlari</el-divider>

      <div
        v-for="(period, i) in local.intervals"
        :key="i"
        class="mb-2 flex items-center gap-2 flex-wrap"
      >
        <el-date-picker
          v-model="period.start"
          type="date"
          placeholder="Boshlanish"
          format="DD.MM.YYYY"
        />
        <el-date-picker
          v-model="period.end"
          type="date"
          placeholder="Tugash"
          format="DD.MM.YYYY"
        />
        <el-input-number
          v-model="period.coeff"
          :min="1"
          :max="3"
          step="0.5"
          label="Koef"
        />
        <el-button type="danger" @click="removePeriod(i)">-</el-button>
      </div>

      <el-button type="primary" @click="addPeriod" plain>+ Davr qo'shish</el-button>

      <el-divider />

      <div class="text-sm p-2 bg-gray-50 rounded-lg mb-3">
        <b>Jami yillik hisob:</b> {{ totalYears.toFixed(2) }} yil  
        <span v-if="totalYears >= 20" class="text-green-600 font-bold">
          ✅ Nafaqada bo‘ladi
        </span>
        <span v-else class="text-red-600 font-bold">
          ❌ Hali 20 yil to‘lmagan
        </span>
      </div>

      <!-- 🔹 Tugmalar -->
      <div class="flex justify-end gap-2">
        <el-button type="success" @click="saveData">💾 Ma'lumotni saqlash</el-button>
        <el-button @click="onClose">Yopish</el-button>
      </div>
    </el-form>

    <el-divider />

    <div v-if="employees.length > 0" class="p-2">
      <el-alert
        title="Saqlangan xodimlar ro‘yxati"
        type="info"
        show-icon
        :closable="false"
        class="mb-3"
      />
      <el-table :data="employees" border stripe>
        <el-table-column prop="name" label="Ism" width="140" />
        <el-table-column prop="totalYears" label="Jami (yil)" width="100" />
        <el-table-column label="Holat" width="150">
          <template #default="{ row }">
            <span v-if="row.totalYears >= 20" class="text-green-600 font-bold">
              Nafaqada
            </span>
            <span v-else class="text-yellow-600 font-bold">
              {{ (20 - row.totalYears).toFixed(1) }} yil qoldi
            </span>
          </template>
        </el-table-column>

        <el-table-column label="1.5x rejimda pensiyaga chiqishgacha (kun)">
          <template #default="{ row }">
            <span v-if="row.totalDays < 7300">
              {{ ((7300 - row.totalDays) / 1.5).toFixed(0) }}
            </span>
            <span v-else>✅ Nafaqada</span>
          </template>
        </el-table-column>

        <el-table-column label="2x rejimda pensiyaga chiqishgacha (kun)">
          <template #default="{ row }">
            <span v-if="row.totalDays < 7300">
              {{ ((7300 - row.totalDays) / 2).toFixed(0) }}
            </span>
            <span v-else>✅ Nafaqada</span>
          </template>
        </el-table-column>

        <!-- 🗑️ O'chirish ustuni -->
        <el-table-column label="Amal" width="100">
          <template #default="{ $index, row }">
            <el-button
              type="danger"
              size="small"
              @click="deleteEmployee($index, row)"
            >
              🗑️ O'chirish
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  employee: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const local = reactive({
  name: '',
  intervals: [{ start: '', end: '', coeff: 1.5 }]
})

const employees = ref([])

onMounted(() => {
  const saved = localStorage.getItem('employees')
  if (saved) employees.value = JSON.parse(saved)
})

watch(() => props.employee, (v) => {
  if (v) Object.assign(local, v)
  else {
    local.name = ''
    local.intervals = [{ start: '', end: '', coeff: 1.5 }]
  }
}, { immediate: true })

function addPeriod() {
  local.intervals.push({ start: '', end: '', coeff: 1 })
}

function removePeriod(i) {
  local.intervals.splice(i, 1)
}

const totalDays = computed(() => {
  let total = 0
  for (const p of local.intervals) {
    if (p.start && p.end) {
      const start = new Date(p.start)
      const end = new Date(p.end)
      const days = (end - start) / (1000 * 60 * 60 * 24)
      total += days * (p.coeff || 1)
    }
  }
  return total
})

const totalYears = computed(() => totalDays.value / 365)

function saveToLocalStorage() {
  localStorage.setItem('employees', JSON.stringify(employees.value))
}

function onClose() {
  visible.value = false
}

function saveData() {
  if (!local.name) {
    ElMessage.error('❌ Xodim ismini kiriting!')
    return
  }

  const data = {
    name: local.name,
    intervals: JSON.parse(JSON.stringify(local.intervals)),
    totalDays: totalDays.value,
    totalYears: totalYears.value
  }

  employees.value.push(data)
  saveToLocalStorage()

  ElMessage({
    message: `✅ ${local.name} ma'lumotlari saqlandi!`,
    type: 'success',
    duration: 2500,
    showClose: true,
    offset: 60,
  })

  // Formani tozalaymiz
  local.name = ''
  local.intervals = [{ start: '', end: '', coeff: 1.5 }]
}

// 🗑️ Xodimni o‘chirish funksiyasi
function deleteEmployee(index, row) {
  employees.value.splice(index, 1)
  saveToLocalStorage()

  ElMessage({
    message: `🗑️ ${row.name} ma'lumotlari o‘chirildi!`,
    type: 'warning',
    duration: 2500,
    offset: 60,
    showClose: true,
  })
}
</script>

<style scoped>
.mb-2 { margin-bottom: 0.5rem; }
.flex { display: flex; }
.gap-2 { gap: 0.5rem; }
</style>
