```vue
<template>
  <div v-if="user" class="debtlist-container px-6 py-8">
    <!-- Search / Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6 items-center">
      <div class="w-full md:w-1/2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full glass-input pl-10 pr-4 py-2 rounded-full text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400"
            placeholder="Search by name or item..."
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div class="w-full md:w-1/2 flex gap-4 justify-end">
        <select
          v-model="statusFilter"
          class="glass-input rounded-full px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <select
          v-model="typeFilter"
          class="glass-input rounded-full px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Types</option>
          <option value="Sangla">Sangla</option>
          <option value="Gloan">Gloan</option>
          <option value="Gredit">Gcredit</option>
          <option value="Splaylater">Splaylater</option>
        </select>
      </div>
    </div>

    <!-- Debt List -->
    <div class="space-y-4">
      <div
        v-for="debt in filteredDebts"
        :key="debt.id"
        class="glass-item p-4 rounded-xl flex justify-between items-center transition-all duration-300"
        :class="{
          'border-l-4 border-yellow-400': isDueSoon(debt.renewalDate, debt.dueDate, debt.loanType),
        }"
      >
        <div class="space-y-1">
          <h6 class="text-lg font-semibold text-gray-900">
            {{ debt.debtSource }}
            <span class="text-sm text-gray-500">({{ debt.loanType }})</span>
          </h6>
          <div v-if="debt.item" class="text-sm text-gray-600">Item: {{ debt.item }}</div>
          <div v-if="debt.loanType === 'Sangla' && debt.loanAmount" class="text-sm text-gray-600">
            Loan Amount: ₱{{ debt.loanAmount.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600">
            <strong>Amount:</strong> ₱{{ debt.amount.toLocaleString() }}
          </div>
          <div v-if="debt.renewalDate && debt.loanType === 'Sangla'" class="text-sm text-gray-600">
            <strong>Renewal:</strong> {{ formatDate(debt.renewalDate) }}
          </div>
          <div
            v-if="['Splaylater', 'Gloan', 'Gredit'].includes(debt.loanType) && debt.dueDate"
            class="text-sm text-gray-600"
          >
            <strong>Due Date:</strong> {{ formatDate(debt.dueDate) }}
          </div>
          <div class="mt-2">
            <strong>Status:</strong>
            <span
              class="inline-block px-2 py-1 rounded-full text-xs font-medium"
              :class="debt.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ debt.isPaid ? 'Paid' : 'Unpaid' }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="togglePaidStatus(debt.id, debt.isPaid)"
            class="btn glass-btn bg-green-100 text-green-700 hover:bg-green-200 rounded-full p-2"
            title="Toggle Paid"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            @click="confirmDelete(debt.id, debt.debtSource)"
            class="btn glass-btn bg-red-100 text-red-700 hover:bg-red-200 rounded-full p-2"
            title="Delete"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="!filteredDebts.length" class="glass-item p-4 rounded-xl text-center text-gray-500">
        No debts recorded yet.
      </div>
    </div>
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
const isDueSoon = (renewalDate, dueDate, loanType) => {
  const today = new Date()
  let targetDate = null

  if (loanType === 'Sangla' && renewalDate) {
    targetDate = new Date(renewalDate)
  } else if (['Splaylater', 'Gloan', 'Gredit'].includes(loanType) && dueDate) {
    targetDate = new Date(dueDate)
  }

  if (!targetDate) return false

  const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays >= 0
}

const dueSoonDebts = computed(() =>
  debts.value.filter((d) => !d.isPaid && isDueSoon(d.renewalDate, d.dueDate, d.loanType)),
)

// Totals
const totalDebt = computed(() => debts.value.reduce((sum, d) => sum + (d.amount || 0), 0))
const totalSanglaLoanAmount = computed(() =>
  debts.value.reduce(
    (sum, d) => sum + (d.loanType === 'Sangla' && d.loanAmount ? d.loanAmount : 0),
    0,
  ),
)

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
  padding-bottom: 4rem;
}

.glass-input,
.glass-item {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.25);
  outline: none;
}

.glass-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.glass-btn:hover {
  transform: scale(1.05);
}
</style>
```
