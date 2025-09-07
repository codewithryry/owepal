<template>
  <div v-if="user" class="debtlist-container px-4 py-4">
    <!-- Search / Filters -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6 mb-2 mb-md-0">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control glass-input"
          placeholder="Search by name or item..."
        />
      </div>
      <div class="col-md-6 d-flex gap-2 justify-content-md-end">
        <select v-model="statusFilter" class="form-select glass-input" style="width: auto">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <select v-model="typeFilter" class="form-select glass-input" style="width: auto">
          <option value="all">All Types</option>
          <option value="Sangla">Sangla</option>
          <option value="Gloan">Gloan</option>
          <option value="Gredit">Gredit</option>
          <option value="Splaylater">Splaylater</option>
        </select>
      </div>
    </div>

    <!-- Due Soon Alert -->
    <div v-if="dueSoonDebts.length" class="alert alert-warning glass-card">
      <h6 class="fw-bold mb-2">Renewal Due Soon</h6>
      <ul class="mb-0">
        <li v-for="debt in dueSoonDebts" :key="debt.id">
          <strong>{{ debt.debtSource }}</strong> - {{ formatDate(debt.renewalDate) }}
        </li>
      </ul>
    </div>

    <!-- Total Debt -->
    <div class="card mb-4 glass-card shadow-sm border-0">
      <div class="card-body">
        <h5 class="fw-bold mb-0">Total Debt: ₱{{ totalDebt.toLocaleString() }}</h5>
      </div>
    </div>

    <!-- Debt List -->
    <ul class="list-group">
      <li
        v-for="debt in filteredDebts"
        :key="debt.id"
        class="list-group-item glass-item d-flex justify-content-between align-items-center mb-2"
        :class="{ 'border-warning': isDueSoon(debt.renewalDate) }"
      >
        <div>
          <h6 class="mb-1">
            {{ debt.debtSource }} <small class="text-muted">({{ debt.loanType }})</small>
          </h6>
          <div v-if="debt.item" class="text-muted small">Item: {{ debt.item }}</div>
          <div v-if="debt.renewalDate" class="text-muted small">
            Renewal: {{ formatDate(debt.renewalDate) }}
          </div>
          <div class="mt-1">
            Status:
            <span :class="debt.isPaid ? 'text-success' : 'text-danger'">{{
              debt.isPaid ? 'Paid' : 'Unpaid'
            }}</span>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button
            @click="togglePaidStatus(debt.id, debt.isPaid)"
            class="btn btn-sm btn-outline-success"
            title="Toggle Paid"
          >
            ✔
          </button>
          <button
            @click="confirmDelete(debt.id, debt.debtSource)"
            class="btn btn-sm btn-outline-danger"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </li>
      <li v-if="!filteredDebts.length" class="list-group-item text-center text-muted glass-item">
        No debts recorded yet.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const user = inject('user')

const debts = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

// Load debts
onMounted(() => {
  if (user.value) {
    const q = query(
      collection(db, 'debts'),
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc'),
    )
    onSnapshot(q, (snapshot) => {
      debts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    })
  }
})

// Filters
const filteredDebts = computed(() =>
  debts.value.filter((debt) => {
    const matchesSearch =
      searchQuery.value === '' ||
      debt.debtSource.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (debt.item && debt.item.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'paid' && debt.isPaid) ||
      (statusFilter.value === 'unpaid' && !debt.isPaid)

    const matchesType = typeFilter.value === 'all' || debt.loanType === typeFilter.value

    return matchesSearch && matchesStatus && matchesType
  }),
)

// Due soon
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

// Totals
const totalDebt = computed(() => debts.value.reduce((sum, d) => sum + d.amount, 0))

// Actions
const togglePaidStatus = async (id, currentStatus) => {
  await updateDoc(doc(db, 'debts', id), { isPaid: !currentStatus })
}

const confirmDelete = async (id, debtSource) => {
  if (window.confirm(`Delete debt from "${debtSource}"?`)) {
    await deleteDoc(doc(db, 'debts', id))
  }
}

// Date formatting
const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<style scoped>
.debtlist-container {
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* Glass effect for cards and inputs */
.glass-card,
.glass-input,
.glass-item {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.glass-card:hover,
.glass-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Input styling */
.glass-input {
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  box-shadow: none;
}

.list-group-item {
  border: none;
  background: transparent;
  transition: all 0.2s;
}

.border-warning {
  border-left: 5px solid #ffc107 !important;
}
</style>
