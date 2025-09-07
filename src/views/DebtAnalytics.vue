<template>
  <div class="container py-5">
    <h2 class="mb-4 fw-bold text-primary">Debt Analytics</h2>

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
                  v-for="(amt, type) in debtByType"
                  :key="type"
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                >
                  <span class="fw-medium">{{ type }}</span>
                  <strong class="text-danger">₱{{ formatNumber(amt) }}</strong>
                </li>
                <li
                  v-if="!Object.keys(debtByType).length"
                  class="list-group-item text-muted border-0 py-3 text-center"
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
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                >
                  <span>Total Debt</span>
                  <strong>₱{{ formatNumber(totalDebt) }}</strong>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                >
                  <span>Paid</span>
                  <strong class="text-success">₱{{ formatNumber(paidDebt) }}</strong>
                </li>
                <li
                  class="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
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
          <h6 class="mb-2 text-secondary fw-medium">Progress Toward ₱1,000,000 Limit</h6>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot, query, orderBy, where as firestoreWhere } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/config'

const user = ref(null)
const debts = ref([])
const loading = ref(false)
let debtsUnsub = null

const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : n)

const debtByType = computed(() => {
  const res = {}
  debts.value.forEach((d) => {
    if (!d.isPaid) res[d.loanType] = (res[d.loanType] || 0) + (Number(d.amount) || 0)
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
const debtProgress = computed(() => Math.min((totalDebt.value / 1000000) * 100, 100))

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

.list-group-item {
  border: none;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
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
