<template>
  <el-card class="p-4 shadow-md rounded-xl max-w-4xl mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4 text-gray-700 text-center">
      🧮 Nafaqa hisoblash tizimi
    </h2>

    <!-- Bitta forma -->
    <el-form label-width="150px" @submit.prevent="hisobla">
      <el-form-item label="Ishchi ismi">
        <el-input v-model="ism" placeholder="Masalan: Bexruz" />
      </el-form-item>

      <!-- Ish davrlari -->
      <el-table :data="davrlar" border size="small" class="mb-3">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="Boshlanish sana" width="180">
          <template #default="{ row }">
            <el-date-picker
              v-model="row.boshlanish"
              type="date"
              format="DD.MM.YYYY"
              placeholder="Boshlanish"
            />
          </template>
        </el-table-column>
        <el-table-column label="Tugash sana" width="180">
          <template #default="{ row }">
            <el-date-picker
              v-model="row.tugash"
              type="date"
              format="DD.MM.YYYY"
              placeholder="Tugash"
            />
          </template>
        </el-table-column>
        <el-table-column label="Hisob turi" width="160">
          <template #default="{ row }">
            <el-select v-model="row.koef" placeholder="Tanlang">
              <el-option label="1 kun = 1.5 kun" :value="1.5" />
              <el-option label="1 kun = 2 kun" :value="2" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Amal" width="120">
          <template #default="{ $index }">
            <el-button
              type="danger"
              size="small"
              @click="davrOchir($index)"
            >🗑️ O‘chirish</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-between mb-3">
        <el-button type="primary" plain @click="davrQoshish">
          ➕ Yangi davr qo‘shish
        </el-button>
        <el-button type="success" native-type="submit">
          Hisoblash
        </el-button>
      </div>
    </el-form>

    <!-- Natija -->
    <div v-if="natija" class="mt-4">
      <el-alert
        :title="natija"
        :type="natija.includes('nafaqada') ? 'success' : 'warning'"
        show-icon
      />
    </div>

    <!-- Saqlanganlar -->
    <el-divider />
    <div v-if="xodimlar.length > 0">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">📋 Saqlangan xodimlar</h3>
        <el-button type="danger" plain @click="tozalash">
          🧹 Barcha ma'lumotlarni o‘chirish
        </el-button>
      </div>

      <el-table :data="xodimlar" border stripe>
        <el-table-column prop="ism" label="Ism" width="150" />
        <el-table-column prop="umumiyYil" label="Ekv. yil" width="120" />
        <el-table-column prop="umumiyKun" label="Umumiy kun" width="120" />
        <el-table-column label="Holat" width="150">
          <template #default="{ row }">
            <span v-if="row.nafaqada" class="text-green-600 font-bold">
              ✅ Nafaqada
            </span>
            <span v-else class="text-yellow-600 font-bold">
              {{ row.qoldiYil.toFixed(1) }} yil qoldi
            </span>
          </template>
        </el-table-column>
        <el-table-column label="1.5x rejimda qolgan kun" width="180">
          <template #default="{ row }">
            <span v-if="row.nafaqada">0</span>
            <span v-else>{{ ((20 - row.umumiyYil) / 1.5 * 365).toFixed(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="2x rejimda qolgan kun" width="180">
          <template #default="{ row }">
            <span v-if="row.nafaqada">0</span>
            <span v-else>{{ ((20 - row.umumiyYil) / 2 * 365).toFixed(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Amal" width="120">
          <template #default="{ $index, row }">
            <el-button type="danger" size="small" @click="ochirish($index, row)">
              🗑️ O‘chirish
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const ism = ref('')
const natija = ref('')
const xodimlar = ref([])
const davrlar = ref([{ boshlanish: '', tugash: '', koef: 1.5 }])

onMounted(() => {
  const saved = localStorage.getItem('xodimlar')
  if (saved) xodimlar.value = JSON.parse(saved)
})

function saqlash() {
  localStorage.setItem('xodimlar', JSON.stringify(xodimlar.value))
}

function davrQoshish() {
  davrlar.value.push({ boshlanish: '', tugash: '', koef: 1.5 })
}
function davrOchir(i) {
  davrlar.value.splice(i, 1)
}

function hisobla() {
  if (!ism.value) return ElMessage.error('❌ Ishchi ismini kiriting!')

  let umumiyKun = 0
  for (const d of davrlar.value) {
    if (!d.boshlanish || !d.tugash)
      return ElMessage.error('❌ Sana to‘liq emas!')
    const start = new Date(d.boshlanish)
    const end = new Date(d.tugash)
    if (end <= start) return ElMessage.error('❌ Tugash sanasi noto‘g‘ri!')
    const kunlar = (end - start) / (1000 * 60 * 60 * 24)
    umumiyKun += kunlar * d.koef
  }

  const umumiyYil = umumiyKun / 365
  const nafaqada = umumiyYil >= 20
  const qoldiYil = 20 - umumiyYil

  natija.value = nafaqada
    ? `${ism.value} nafaqada (${umumiyYil.toFixed(1)} yil ekv.)`
    : `${ism.value} hali ${qoldiYil.toFixed(1)} yil ishlashi kerak.`

  const yangi = {
    ism: ism.value,
    umumiyKun: umumiyKun.toFixed(0),
    umumiyYil: umumiyYil.toFixed(1),
    qoldiYil,
    nafaqada
  }

  xodimlar.value.push(yangi)
  saqlash()

  ElMessage.success(`✅ ${ism.value} ma'lumotlari saqlandi!`)
  ism.value = ''
  davrlar.value = [{ boshlanish: '', tugash: '', koef: 1.5 }]
}

function ochirish(index, row) {
  xodimlar.value.splice(index, 1)
  saqlash()
  ElMessage({
    message: `🗑️ ${row.ism} ma'lumoti o‘chirildi!`,
    type: 'warning',
    duration: 2500,
    offset: 60
  })
}

function tozalash() {
  ElMessageBox.confirm(
    "Barcha saqlangan ma'lumotlarni o‘chirishni istaysizmi?",
    'Tasdiqlash',
    {
      confirmButtonText: 'Ha, o‘chir',
      cancelButtonText: 'Bekor qilish',
      type: 'warning'
    }
  )
    .then(() => {
      localStorage.clear()
      xodimlar.value = []
      ElMessage({
        message: '🧹 Barcha maʼlumotlar o‘chirildi!',
        type: 'success',
        duration: 2500,
        offset: 60
      })
    })
    .catch(() => {
      ElMessage.info('❎ O‘chirish bekor qilindi.')
    })
}
</script>

<style scoped>
.text-green-600 {
  color: #16a34a;
}
.text-yellow-600 {
  color: #ca8a04;
}
.text-gray-700 {
  color: #374151;
}
</style>
