<template>
  <div class="container py-5">
    <div v-if="loading" class="text-muted text-center py-5">Loading data...</div>

    <div v-else>
      <div class="row g-4">
        <!-- Loan Type Breakdown -->
        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0 rounded-4 glass-card">
            <div class="card-body">
              <h5 class="card-title mb-3 text-secondary fw-semibold">By Loan Type (Unpaid)</h5>
              <ul class="list-group list-group-flush">
                <li
                  v-for="(data, type) in debtByType"
                  :key="type"
                  class="list-group-item d-flex justify-content-between align-items-start border-0 py-3 glass-item"
                >
                  <span class="fw-medium">{{ type }}</span>
                  <div class="text-end">
                    <strong class="text-danger">₱{{ formatNumber(data.amount) }}</strong>
                    <div v-if="type === 'Sangla' && data.loanAmount" class="text-muted small">
                      Loan: ₱{{ formatNumber(data.loanAmount) }}
                    </div>
                  </div>
                </li>
                <li
                  v-if="!Object.keys(debtByType).length"
                  class="list-group-item text-muted border-0 py-3 text-center glass-item"
                >
                  No unpaid debts by type
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Status Overview -->
        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0 rounded-4 glass-card">
            <div class="card-body">
              <h5 class="card-title mb-3 text-secondary fw-semibold">Status Overview</h5>
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item d-flex justify-content-between align-items-start border-0 py-3 glass-item"
                >
                  <span>Total Debt</span>
                  <div class="text-end">
                    <strong>₱{{ formatNumber(totalDebt) }}</strong>
                    <div v-if="totalSanglaLoanAmount > 0" class="text-muted small">
                      Total Sangla Loan: ₱{{ formatNumber(totalSanglaLoanAmount) }}
                    </div>
                  </div>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 glass-item"
                >
                  <span>Paid</span>
                  <strong class="text-success">₱{{ formatNumber(paidDebt) }}</strong>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3 glass-item"
                >
                  <span>Unpaid</span>
                  <strong class="text-danger">₱{{ formatNumber(totalUnpaidDebt) }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Card -->
      <div class="card mt-4 shadow-sm border-0 rounded-4 glass-card">
        <div class="card-body">
          <h6 class="mb-2 text-secondary fw-medium">Progress Toward ₱100,000 Limit</h6>
          <div class="progress rounded-pill" style="height: 14px">
            <div
              class="progress-bar bg-primary"
              role="progressbar"
              :style="{ width: debtProgress + '%' }"
            ></div>
          </div>
          <div class="small text-muted mt-2">{{ debtProgress.toFixed(1) }}%</div>
        </div>
      </div>

      <!-- Monthly Debt Trend -->
      <div class="card mt-4 shadow-sm border-0 rounded-4 glass-card">
        <div class="card-body">
          <h5 class="mb-3 text-secondary fw-semibold">Monthly Debt Trend</h5>
          <canvas id="monthlyDebtChart"></canvas>
        </div>
      </div>

      <!-- Paid vs Unpaid Pie Chart -->
      <div class="card mt-4 shadow-sm border-0 rounded-4 glass-card">
        <div class="card-body">
          <h5 class="mb-3 text-secondary fw-semibold">Paid vs Unpaid</h5>
          <canvas id="paidUnpaidChart"></canvas>
        </div>
      </div>

      <!-- Overdue Debts -->
      <div class="card mt-4 shadow-sm border-0 rounded-4 glass-card">
        <div class="card-body">
          <h5 class="mb-3 text-secondary fw-semibold">Overdue Debts</h5>
          <ul class="list-group list-group-flush">
            <li
              v-for="d in overdueDebts"
              :key="d.id"
              class="list-group-item text-danger d-flex justify-content-between align-items-start border-0 py-3 glass-item"
            >
              <span>{{ d.loanType }}</span>
              <div class="text-end">
                <span>₱{{ formatNumber(d.amount) }}</span>
                <div v-if="d.loanType === 'Sangla' && d.loanAmount" class="text-muted small">
                  Loan: ₱{{ formatNumber(d.loanAmount) }}
                </div>
                <div class="text-muted small">
                  Due: {{ d.dueDate?.toDate().toLocaleDateString() }}
                </div>
              </div>
            </li>
            <li
              v-if="!overdueDebts.length"
              class="list-group-item text-muted text-center glass-item"
            >
              No overdue debts
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { collection, onSnapshot, query, orderBy, where as firestoreWhere } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/config'
import Chart from 'chart.js/auto'

const user = ref(null)
const debts = ref([])
const loading = ref(false)
let debtsUnsub = null

const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : n)

const debtByType = computed(() => {
  const res = {}
  debts.value.forEach((d) => {
    if (!d.isPaid) {
      if (!res[d.loanType]) {
        res[d.loanType] = { amount: 0, loanAmount: 0 }
      }
      res[d.loanType].amount += Number(d.amount || 0)
      if (d.loanType === 'Sangla' && d.loanAmount) {
        res[d.loanType].loanAmount += Number(d.loanAmount || 0)
      }
    }
  })
  return res
})

const paidDebt = computed(() =>
  debts.value.reduce((s, d) => (d.isPaid ? s + Number(d.amount || 0) : s), 0),
)
const totalUnpaidDebt = computed(() =>
  debts.value.reduce((s, d) => (!d.isPaid ? s + Number(d.amount || 0) : s), 0),
)
const totalDebt = computed(() => debts.value.reduce((s, d) => s + Number(d.amount || 0), 0))
const totalSanglaLoanAmount = computed(() =>
  debts.value.reduce(
    (s, d) => s + (d.loanType === 'Sangla' && d.loanAmount ? Number(d.loanAmount) : 0),
    0,
  ),
)
const debtProgress = computed(() => Math.min((totalDebt.value / 100000) * 100, 100))

const debtBySource = computed(() => {
  const res = {}
  debts.value.forEach((d) => {
    res[d.debtSource] = (res[d.debtSource] || 0) + Number(d.amount || 0)
  })
  return Object.fromEntries(
    Object.entries(res)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
  )
})

const overdueDebts = computed(() => {
  const today = new Date()
  return debts.value.filter((d) => !d.isPaid && d.dueDate?.toDate?.() < today)
})

const loadUserDebts = (userId) => {
  if (typeof debtsUnsub === 'function') debtsUnsub()
  loading.value = true
  const debtsQuery = query(
    collection(db, 'debts'),
    firestoreWhere('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  debtsUnsub = onSnapshot(debtsQuery, (snapshot) => {
    debts.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    loading.value = false

    nextTick(() => {
      // Monthly Debt Chart
      const monthlyCtx = document.getElementById('monthlyDebtChart')?.getContext('2d')
      if (monthlyCtx) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1)
        const totals = Array(12).fill(0)
        debts.value.forEach((d) => {
          const date = d.createdAt?.toDate?.() || new Date()
          totals[date.getMonth()] += Number(d.amount || 0)
        })
        new Chart(monthlyCtx, {
          type: 'line',
          data: {
            labels: months.map((m) => `Month ${m}`),
            datasets: [
              {
                label: 'Debt Amount',
                data: totals,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { display: false } } },
        })
      }

      // Paid vs Unpaid Chart
      const paidCtx = document.getElementById('paidUnpaidChart')?.getContext('2d')
      if (paidCtx) {
        new Chart(paidCtx, {
          type: 'pie',
          data: {
            labels: ['Paid', 'Unpaid'],
            datasets: [
              {
                data: [paidDebt.value, totalUnpaidDebt.value],
                backgroundColor: ['#198754', '#dc3545'],
              },
            ],
          },
          options: { responsive: true },
        })
      }
    })
  })
}

onMounted(() => {
  const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    if (firebaseUser) loadUserDebts(firebaseUser.uid)
    else debts.value = []
  })

  onUnmounted(() => {
    unsubAuth()
    if (typeof debtsUnsub === 'function') debtsUnsub()
  })
})
</script>

<style scoped>
h2 {
  font-size: 1.75rem;
  font-weight: 700;
}

.card {
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-title {
  font-size: 1.1rem;
  color: #757575;
}

.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
}

.glass-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.glass-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.list-group-item {
  border: none;
  background: transparent;
}

.progress {
  background-color: #e0e0e0;
  border-radius: 0.5rem;
}

.progress-bar {
  background-color: #0d6efd;
  border-radius: 0.5rem;
}
</style>
