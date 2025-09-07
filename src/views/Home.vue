<template>
  <div
    v-if="user"
    class="dashboard-container min-vh-100 px-4 py-4"
    :class="darkMode ? 'dark-mode' : ''"
  >
    <!-- Header -->
    <header class="d-flex justify-content-between align-items-center mb-5">
      <h5 class="text-muted m-0">Your financial overview for {{ currentDate }}</h5>
    </header>

    <!-- Summary Cards -->
    <div class="row g-4 mb-5">
      <div v-for="card in summaryCards" :key="card.title" class="col-xl-3 col-md-6">
        <div class="card glass-card h-100 shadow-sm border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle mb-2 text-muted">{{ card.title }}</h6>
              <h3 class="fw-bold" :class="card.textClass">{{ card.value }}</h3>
              <p class="small text-muted mt-2">
                <span v-if="card.subtitle" :class="card.changeClass">{{ card.subtitle }}</span>
              </p>
            </div>
            <div :class="['icon-circle', card.bgClass]">
              <i :class="card.iconClass"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Due Soon Section -->
    <div class="row g-4">
      <!-- Debt Distribution Chart -->
      <div class="col-lg-8">
        <div class="card glass-card shadow-sm h-100 border-0">
          <div class="card-header bg-transparent border-0 pt-4">
            <h5 class="fw-bold">Debt Distribution</h5>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height: 250px">
              <canvas ref="debtChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Due Soon List -->
      <div class="col-lg-4">
        <div class="card glass-card shadow-sm h-100 border-0">
          <div class="card-header d-flex justify-content-between align-items-center pt-4 border-0">
            <h5 class="fw-bold mb-0">Due Soon</h5>
            <span class="badge bg-warning text-dark">{{ dueSoonDebts.length }}</span>
          </div>
          <div class="card-body p-0">
            <div v-if="dueSoonDebts.length" class="list-group list-group-flush">
              <div
                v-for="debt in dueSoonDebts"
                :key="debt.id"
                class="list-group-item px-3 py-3 glass-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <h6 class="mb-1">{{ debt.debtSource }}</h6>
                  <small class="text-muted">Due: {{ formatDate(debt.renewalDate) }}</small>
                </div>
                <span class="badge bg-light text-dark fs-6"
                  >₱{{ debt.amount.toLocaleString() }}</span
                >
              </div>
            </div>
            <div v-else class="text-center py-5">
              <i class="bi bi-check-circle text-success fs-1 mb-3"></i>
              <p class="text-muted">No debts due soon. Good job!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import Chart from 'chart.js/auto'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const user = inject('user')
const darkMode = inject('darkMode')
const debts = ref([])
const debtChart = ref(null)
let chartInstance = null

// Fetch debts from Firebase
onMounted(() => {
  if (user.value) {
    const debtsQuery = query(
      collection(db, 'debts'),
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc'),
    )
    onSnapshot(debtsQuery, (snapshot) => {
      debts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    })
  }
})

// Watch debts to update chart
watch(
  debts,
  () => {
    if (debts.value.length && debtChart.value) updateChart()
  },
  { deep: true },
)

// Date display
const currentDate = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// Calculate totals
const totalDebt = computed(() => debts.value.reduce((sum, d) => sum + d.amount, 0))
const activeDebts = computed(() => debts.value.filter((d) => !d.isPaid).length)
const paidDebts = computed(() => debts.value.filter((d) => d.isPaid).length)
const monthlyPayment = computed(() => debts.value.reduce((sum, d) => sum + d.amount / 12, 0))
const installments = computed(() => debts.value.filter((d) => d.amount > 0).length)

// Due soon debts
const isDueSoon = (dateStr) => {
  if (!dateStr) return false
  const today = new Date()
  const renewal = new Date(dateStr)
  const diffDays = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays >= 0
}
const dueSoonDebts = computed(() =>
  debts.value.filter((d) => d.renewalDate && !d.isPaid && isDueSoon(d.renewalDate)),
)
const nextDueDays = computed(() => {
  if (!dueSoonDebts.value.length) return 0
  const soonest = dueSoonDebts.value.reduce((min, debt) => {
    const debtDate = new Date(debt.renewalDate)
    return debtDate < min ? debtDate : min
  }, new Date(dueSoonDebts.value[0].renewalDate))
  return Math.ceil((soonest - new Date()) / (1000 * 60 * 60 * 24))
})

// Format date
const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

// Chart setup
const updateChart = () => {
  if (chartInstance) chartInstance.destroy()
  const ctx = debtChart.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: debts.value.map((d) => d.debtSource),
      datasets: [
        {
          data: debts.value.map((d) => d.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: darkMode.value ? '#fff' : '#212529' } },
      },
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    if (debtChart.value) updateChart()
  }, 300)
})

// Summary cards config
const summaryCards = computed(() => [
  {
    title: 'Total Debt',
    value: `₱${totalDebt.value.toLocaleString()}`,
    subtitle: '-2.5% from last month',
    textClass: 'text-danger',
    changeClass: 'text-danger small',
    iconClass: 'bi bi-currency-dollar fs-3 text-danger',
    bgClass: 'bg-danger-subtle',
  },
  {
    title: 'Active Debts',
    value: activeDebts.value,
    subtitle: `${paidDebts.value} debts paid recently`,
    textClass: '',
    changeClass: '',
    iconClass: 'bi bi-file-earmark-text fs-3 text-primary',
    bgClass: 'bg-primary-subtle',
  },
  {
    title: 'Due Soon',
    value: dueSoonDebts.value.length,
    subtitle: `Next due in ${nextDueDays.value} days`,
    textClass: 'text-warning',
    changeClass: 'text-warning small',
    iconClass: 'bi bi-clock fs-3 text-warning',
    bgClass: 'bg-warning-subtle',
  },
  {
    title: 'Monthly Payment',
    value: `₱${monthlyPayment.value.toLocaleString()}`,
    subtitle: `${installments.value} installments ongoing`,
    textClass: 'text-info',
    changeClass: '',
    iconClass: 'bi bi-calendar-check fs-3 text-info',
    bgClass: 'bg-info-subtle',
  },
])
</script>

<style scoped>
.dashboard-container {
  padding-bottom: 3rem;
  transition: background 0.3s;
}
.dark-mode {
  background-color: #121212;
  color: #fff;
}
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.dark-mode .glass-card {
  background: rgba(32, 32, 32, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
.bg-danger-subtle {
  background-color: rgba(255, 99, 132, 0.15);
}
.bg-primary-subtle {
  background-color: rgba(54, 162, 235, 0.15);
}
.bg-warning-subtle {
  background-color: rgba(255, 206, 86, 0.15);
}
.bg-info-subtle {
  background-color: rgba(75, 192, 192, 0.15);
}
.glass-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 0.25rem 0;
  padding: 0.75rem 1rem;
  transition: transform 0.2s;
}
.glass-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}
</style>
